// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportQuestion from '../../../app/model/question';
import ExportUser from '../../../app/model/user';

declare module 'egg' {
  interface IModel {
    Question: ReturnType<typeof ExportQuestion>;
    User: ReturnType<typeof ExportUser>;
  }
}
