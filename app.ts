import 'reflect-metadata';
import { IBoot } from 'egg';
export default class FooBoot implements IBoot {
  // constructor(app) {
  //   const errorHandle = require('./app/middleware/errorHandler.ts')()(app, app.next);
  //   app.use(errorHandle);
  // }

  constructor() {
  }

  configWillLoad() {
    // 此时 config 文件已经被读取并合并，但是还并未生效
    // 这是应用层修改配置的最后时机
    // 注意：此函数只支持同步调用
    require('module-alias/register');
    // 例如：参数中的密码是加密的，在此处进行解密
  
    // 例如：插入一个中间件到框架的 coreMiddleware 之间
  }
}