// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportCategory from '../../../app/model/category';
import ExportMenu from '../../../app/model/menu';
import ExportQuestion from '../../../app/model/question';
import ExportRoles from '../../../app/model/roles';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Category: ReturnType<typeof ExportCategory>;
    Menu: ReturnType<typeof ExportMenu>;
    Question: ReturnType<typeof ExportQuestion>;
    Roles: ReturnType<typeof ExportRoles>;
    User: ReturnType<typeof ExportUser>;
  }
}
