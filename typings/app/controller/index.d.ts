// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportMenuIndex from '../../../app/controller/menu/index';
import ExportPaperIndex from '../../../app/controller/paper/index';
import ExportUserIndex from '../../../app/controller/user/index';

declare module 'egg' {
  interface IController {
    menu: {
      index: ExportMenuIndex;
    }
    paper: {
      index: ExportPaperIndex;
    }
    user: {
      index: ExportUserIndex;
    }
  }
}
