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

export const WechatFilled: React.FC<IIconProps> = makeIcon({
    Path: ({ colors }) => <>
    <path d="M6.66413 47.9996C9.8872 47.5484 13.1589 45.3162 13.9849 44.2903C17.8963 45.4394 21.4837 45.825 24.7149 45.6199C24.0216 44.0212 24.039 42.0343 24.0545 40.2663C24.0567 40.0103 24.0589 39.7591 24.0589 39.514C24.0589 29.2394 33.9549 20.4747 45.1141 21.1066C45.2922 21.1148 45.4543 21.1395 45.5999 21.1887C43.5674 12.1532 34.2951 5.3335 23.1519 5.3335C10.5107 5.3335 0.266602 14.1064 0.266602 24.9227C0.266602 34.1799 4.85824 38.6935 9.61186 41.1964C8.99173 43.7964 8.16618 45.2679 7.39912 46.6351C7.14448 47.089 6.89624 47.5314 6.66413 47.9996ZM10.2666 18.771C10.2666 16.9273 11.7563 15.4377 13.5999 15.4377C15.4362 15.4377 16.9333 16.9273 16.9333 18.771C16.9333 20.6072 15.4436 22.1043 13.5999 22.1043C11.7563 22.1043 10.2666 20.6146 10.2666 18.771ZM27.5999 22.6681C29.4437 22.6681 30.9333 21.171 30.9333 19.3348C30.9333 17.4911 29.4437 16.0015 27.5999 16.0015C25.7563 16.0015 24.2666 17.4911 24.2666 19.3348C24.2666 21.1784 25.7563 22.6681 27.5999 22.6681ZM57.5058 58.6666C56.7588 57.2348 55.5559 54.1356 55.7287 53.3332C59.3692 51.6655 63.7255 47.3943 63.7332 39.8898C63.7332 31.1111 55.3748 24.0002 45.0666 24.0002C34.7583 24.0002 26.3999 31.418 26.3999 40.7788C26.3999 50.1159 35.741 59.3431 52.1746 55.9999C54.054 57.6202 56.1847 58.3676 57.5058 58.6666ZM46.3999 35.5626C46.3999 34.0839 47.5876 32.8959 49.0666 32.8959C50.5455 32.8959 51.7332 34.0839 51.7332 35.5626C51.7332 37.0415 50.5455 38.2292 49.0666 38.2292C47.5876 38.2292 46.3999 37.0415 46.3999 35.5626ZM38.3999 32.8647C36.921 32.8647 35.7332 34.0524 35.7332 35.5314C35.7332 37.0103 36.921 38.198 38.3999 38.198C39.8788 38.198 41.0666 37.0103 41.0666 35.5314C41.0666 34.0524 39.8708 32.8647 38.3999 32.8647Z" fill={ colors[0] } fillRule="evenodd" clipRule="evenodd"/>

  </>,
  name: 'wechat_filled',
  defaultColors: ['#D9D9D9'],
  colorful: false,
  allPathData: ['M6.66413 47.9996C9.8872 47.5484 13.1589 45.3162 13.9849 44.2903C17.8963 45.4394 21.4837 45.825 24.7149 45.6199C24.0216 44.0212 24.039 42.0343 24.0545 40.2663C24.0567 40.0103 24.0589 39.7591 24.0589 39.514C24.0589 29.2394 33.9549 20.4747 45.1141 21.1066C45.2922 21.1148 45.4543 21.1395 45.5999 21.1887C43.5674 12.1532 34.2951 5.3335 23.1519 5.3335C10.5107 5.3335 0.266602 14.1064 0.266602 24.9227C0.266602 34.1799 4.85824 38.6935 9.61186 41.1964C8.99173 43.7964 8.16618 45.2679 7.39912 46.6351C7.14448 47.089 6.89624 47.5314 6.66413 47.9996ZM10.2666 18.771C10.2666 16.9273 11.7563 15.4377 13.5999 15.4377C15.4362 15.4377 16.9333 16.9273 16.9333 18.771C16.9333 20.6072 15.4436 22.1043 13.5999 22.1043C11.7563 22.1043 10.2666 20.6146 10.2666 18.771ZM27.5999 22.6681C29.4437 22.6681 30.9333 21.171 30.9333 19.3348C30.9333 17.4911 29.4437 16.0015 27.5999 16.0015C25.7563 16.0015 24.2666 17.4911 24.2666 19.3348C24.2666 21.1784 25.7563 22.6681 27.5999 22.6681ZM57.5058 58.6666C56.7588 57.2348 55.5559 54.1356 55.7287 53.3332C59.3692 51.6655 63.7255 47.3943 63.7332 39.8898C63.7332 31.1111 55.3748 24.0002 45.0666 24.0002C34.7583 24.0002 26.3999 31.418 26.3999 40.7788C26.3999 50.1159 35.741 59.3431 52.1746 55.9999C54.054 57.6202 56.1847 58.3676 57.5058 58.6666ZM46.3999 35.5626C46.3999 34.0839 47.5876 32.8959 49.0666 32.8959C50.5455 32.8959 51.7332 34.0839 51.7332 35.5626C51.7332 37.0415 50.5455 38.2292 49.0666 38.2292C47.5876 38.2292 46.3999 37.0415 46.3999 35.5626ZM38.3999 32.8647C36.921 32.8647 35.7332 34.0524 35.7332 35.5314C35.7332 37.0103 36.921 38.198 38.3999 38.198C39.8788 38.198 41.0666 37.0103 41.0666 35.5314C41.0666 34.0524 39.8708 32.8647 38.3999 32.8647Z'],
  width: '64',
  height: '64',
  viewBox: '0 0 64 64',
});