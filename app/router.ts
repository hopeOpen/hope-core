import { Application } from 'egg';
import { RequestMapping } from './lib';

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
  // 用户
  requestMapping.scanController(app, 'user', config.apiPrefix, [middleware.jwt(config.jwt)]);
  // 菜单权限
  requestMapping.scanController(app, 'menu', config.apiPrefix, [middleware.jwt(config.jwt)]);
  // 试卷
  requestMapping.scanController(app, 'paper', config.apiPrefix, [middleware.jwt(config.jwt)]);
};
