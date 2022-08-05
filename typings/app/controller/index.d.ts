// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportUserIndex from '../../../app/controller/user/index';

declare module 'egg' {
  interface IController {
    user: {
      index: ExportUserIndex;
    }
  }
}
