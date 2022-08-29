import { Application } from 'egg';
import { RequestMapping } from './lib';
import * as path from 'path';
import * as fs from 'fs';

export default (app: Application) => {
  const { middleware, config } = app;
  app.beforeStart(async function() {
    console.log('beforeStart--->');
    // 开发环境使用，会删除数据表 force  false 为不覆盖 true会删除再创建
    await app.model.sync({
      force: false,
      // alter=true可以 添加或删除字段
      // alter: true,
    }).then(() => {
      console.log('连接数据库成功--->');
    }).catch(error => {
      console.log('连接数据库失败--->', error);
    });
  });

  // 加载路由
  const requestMapping = new RequestMapping();

  // 自动加载 比如[ 'category', 'menu', 'paper', 'user' ]
  const dir = path.join(__dirname, './controller');
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    requestMapping.scanController(app, file, config.apiPrefix, [middleware.jwt(config.jwt)])
  })

};
