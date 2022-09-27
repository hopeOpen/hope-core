import { Application } from 'egg';
import { RequestMapping } from './lib';
import * as path from 'path';
import * as fs from 'fs';
import { SyncDatabase } from './lib/syncDatabase';

export default (app: Application) => {
  const { middleware, config, logger } = app;
  app.beforeStart(async function() {
    logger.info('app beforeStart--->');
    // 开发环境使用，会删除数据表 force  false 为不覆盖 true会删除再创建
    await app.model.sync({
      force: false,
      // alter=true可以 添加或删除字段
      // alter: true,
    }).then(() => {
      logger.info('Database connection is successful --->');
    }).catch(error => {
      logger.info('Database connection fails --->', error);
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
  
  // 同步数据库
  const syncDatabase = new SyncDatabase(app);
  syncDatabase.sync();
};
