/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint-disable max-len */
import React from 'react';
import { makeIcon, IIconProps } from '../utils/icon';

export const ManageOutlined: React.FC<IIconProps> = makeIcon({
  Path: ({ colors }) => <>
    <path d="M13.5 1.71133C12.5718 1.17543 11.4282 1.17543 10.5 1.71133L3.83975 5.55663C2.91155 6.09252 2.33975 7.08291 2.33975 8.1547V15.8453C2.33975 16.9171 2.91155 17.9075 3.83975 18.4434L10.5 22.2887C11.4282 22.8246 12.5718 22.8246 13.5 22.2887L20.1603 18.4434C21.0885 17.9075 21.6603 16.9171 21.6603 15.8453V8.1547C21.6603 7.08291 21.0885 6.09252 20.1603 5.55663L13.5 1.71133ZM11.5 3.44338C11.8094 3.26474 12.1906 3.26474 12.5 3.44338L19.1603 7.28868C19.4697 7.46731 19.6603 7.79744 19.6603 8.1547V15.8453C19.6603 16.2026 19.4697 16.5327 19.1603 16.7113L12.5 20.5566C12.1906 20.7353 11.8094 20.7353 11.5 20.5566L4.83975 16.7113C4.53035 16.5327 4.33975 16.2026 4.33975 15.8453V8.1547C4.33975 7.79744 4.53035 7.46731 4.83975 7.28868L11.5 3.44338ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM12 8C9.79087 8 8.00001 9.79086 8.00001 12C8.00001 14.2091 9.79087 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'manage_outlined',
  defaultColors: ['#C4C4C4'],
  colorful: false,
  allPathData: ['M13.5 1.71133C12.5718 1.17543 11.4282 1.17543 10.5 1.71133L3.83975 5.55663C2.91155 6.09252 2.33975 7.08291 2.33975 8.1547V15.8453C2.33975 16.9171 2.91155 17.9075 3.83975 18.4434L10.5 22.2887C11.4282 22.8246 12.5718 22.8246 13.5 22.2887L20.1603 18.4434C21.0885 17.9075 21.6603 16.9171 21.6603 15.8453V8.1547C21.6603 7.08291 21.0885 6.09252 20.1603 5.55663L13.5 1.71133ZM11.5 3.44338C11.8094 3.26474 12.1906 3.26474 12.5 3.44338L19.1603 7.28868C19.4697 7.46731 19.6603 7.79744 19.6603 8.1547V15.8453C19.6603 16.2026 19.4697 16.5327 19.1603 16.7113L12.5 20.5566C12.1906 20.7353 11.8094 20.7353 11.5 20.5566L4.83975 16.7113C4.53035 16.5327 4.33975 16.2026 4.33975 15.8453V8.1547C4.33975 7.79744 4.53035 7.46731 4.83975 7.28868L11.5 3.44338ZM10 12C10 10.8954 10.8954 10 12 10C13.1046 10 14 10.8954 14 12C14 13.1046 13.1046 14 12 14C10.8954 14 10 13.1046 10 12ZM12 8C9.79087 8 8.00001 9.79086 8.00001 12C8.00001 14.2091 9.79087 16 12 16C14.2091 16 16 14.2091 16 12C16 9.79086 14.2091 8 12 8Z'],
  width: '24',
  height: '24',
  viewBox: '0 0 24 24',
});