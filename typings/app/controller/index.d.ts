// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCategoryIndex from '../../../app/controller/category/index';
import ExportMenuIndex from '../../../app/controller/menu/index';
import ExportPaperIndex from '../../../app/controller/paper/index';
import ExportRoleIndex from '../../../app/controller/role/index';
import ExportUserIndex from '../../../app/controller/user/index';

declare module 'egg' {
  interface IController {
    category: {
      index: ExportCategoryIndex;
    }
    menu: {
      index: ExportMenuIndex;
    }
    paper: {
      index: ExportPaperIndex;
    }
    role: {
      index: ExportRoleIndex;
    }
    user: {
      index: ExportUserIndex;
    }
  }
}
