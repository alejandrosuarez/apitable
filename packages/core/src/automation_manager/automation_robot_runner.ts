import { IActionOutput, IAutomationRobotRunner, IReqMethod } from './interface/automation_robot_runner.interface';
import { IRobot, IActionType, IRobotTask, IRobotTaskRuntimeContext } from './interface/automation.interface';
import { InputParser } from './input_parser';
import { MagicVariableParser } from './magic_variable/magic_variable_parser';
import {
  getNodeOutput, getObjectProperty, concatString,
  concatParagraph, newArray, newObject, JSONStringify, length, flatten
} from './magic_variable/sys_functions';

/**
 * handle workflow execution
 */
export class AutomationRobotRunner extends IAutomationRobotRunner {

  constructor(reqMethods: IReqMethod) {
    super();
    // the reqMethods is used to call api of other service, implement by the host of runner(room-server)
    this.reqMethods = reqMethods;
    this.inputParser = this.initInputParser();
  }
  private initInputParser() {
    // functions below are used to parse input of action, you can add any function you want at `./magic_variable/sys_functions`
    // then add it into sysFunctions array. just like standard lib for programming language
    const sysFunctions = [length, flatten, getNodeOutput, getObjectProperty, concatString, concatParagraph, newArray, newObject, JSONStringify];
    const parser = new MagicVariableParser(sysFunctions);
    return new InputParser(parser);
  }
  async run(robotTask: IRobotTask): Promise<void> {
    const robot = await this.reqMethods.getRobotById(robotTask.robotId);
    const globalContext: IRobotTaskRuntimeContext = this.initRuntimeContext(robotTask, robot);
    const entryActionId = globalContext.robot.entryActionId;
    await this.executeAction(entryActionId, globalContext);
  }
  validateActionInput(actionType: IActionType, input: any): boolean {
    // TODO: implement json schema validation
    return true;
  }
  validateActionOutput(actionType: IActionType, output: any): boolean {
    // TODO: implement json schema validation
    return true;
  }
  initRuntimeContext(robotTask: IRobotTask, robot: IRobot): IRobotTaskRuntimeContext {
    return {
      robot: robot,
      taskId: robotTask.taskId,
      executedNodeIds: [robot.triggerId],
      currentNodeId: robot.triggerId,
      context: {
        [robot.triggerId]: {
          typeId: robot.triggerTypeId,
          input: robotTask.triggerInput,
          output: robotTask.triggerOutput
        }
      },
      isDone: false,
      success: true,
    };
  }
  async executeAction(actionId: string, globalContext: IRobotTaskRuntimeContext) {
    // console.log('globalContext', globalContext, JSON.stringify(globalContext.context));
    globalContext.currentNodeId = actionId;
    const start = new Date().getTime();
    // get instance of the action by id
    const actionInstance = globalContext.robot.actionsById[actionId];
    // get type of the action
    const actionType = globalContext.robot.actionTypesById[actionInstance.typeId];
    // TODO: validate input
    // if (this.validateActionInput(actionType, actionRuntimeInput)) {}
    let output: IActionOutput | undefined;
    const errorStacks: any[] = [];
    let nextActionId: string | undefined;
    // the input of action may have dynamic value, so we need to parse it
    let actionRuntimeInput;
    try {
      try {
        actionRuntimeInput = this.getRuntimeActionInput(actionId, globalContext);
        if (!this.validateActionInput(actionType, actionRuntimeInput)) {
          throw new Error('action input is invalid');
        }
      } catch (error) {
        throw new Error('action input is invalid');
      }
      // TODO: push task to queue, to ensure the order of execution
      try {
        output = await this.reqMethods.requestActionOutput(actionRuntimeInput, actionType);
      } catch (error) {
        // execute action failed, most likely because of network error
        throw new Error('action execute failed');
      }
      nextActionId = actionInstance.nextActionId;
      // console.log(output, nextActionId);
      if (output && !output.success) {
        errorStacks.push(...output.data.errors);
        // when some output of action is failed, we should stop the execution, done but failed
        globalContext.isDone = true;
        globalContext.success = false;
      }
    } catch (error) {
      errorStacks.push({
        message: error.message,
      });
      // unexpected error, we should stop the execution, done but failed
      globalContext.isDone = true;
      globalContext.success = false;
    } finally {
      const end = new Date().getTime();
      globalContext.executedNodeIds.push(globalContext.currentNodeId);
      globalContext.context[actionId] = {
        typeId: actionType.id,
        input: actionRuntimeInput,
        output: output?.data,
        startAt: start,
        endAt: end,
        errorStacks,
      };
    }
    if (globalContext.isDone) {
      await this.reportResult(globalContext.taskId, globalContext);
    } else if (nextActionId) {
      await this.executeAction(nextActionId, globalContext);
    } else {
      await this.reportResult(globalContext.taskId, globalContext);
    }
    // }
  }
  getRuntimeActionInput(actionId: string, globalContext: IRobotTaskRuntimeContext): any {
    return this.inputParser.render(
      globalContext.robot.actionsById[actionId].input,
      globalContext
    );
  }
  async reportResult(taskId: string, globalContext: IRobotTaskRuntimeContext) {
    await this.reqMethods.reportResult(taskId, globalContext.success, {
      executedNodeIds: globalContext.executedNodeIds,
      nodeByIds: globalContext.context,
    });
  }
}