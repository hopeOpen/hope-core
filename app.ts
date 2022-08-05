import 'reflect-metadata';
import { IBoot } from 'egg';
export default class FooBoot implements IBoot {
  // constructor(app) {
  //   const errorHandle = require('./app/middleware/errorHandler.ts')()(app, app.next);
  //   app.use(errorHandle);
  // }

  constructor() {
  }
}