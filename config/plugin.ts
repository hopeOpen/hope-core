import { EggPlugin } from 'egg';

const plugin: EggPlugin = {
  // static: true,
  // nunjucks: {
  //   enable: true,
  //   package: 'egg-view-nunjucks',
  // },

  // json web token
  jwt: {
    // 是否开启
    enable: true,
    // 依赖的包
    package: 'egg-jwt',
  },
  // 一个终端指令，一个是plugin.js内要添加的配置
  cors: {
    enable: true,
    package: 'egg-cors',
  },
  // 引入egg-sequelize包
  sequelize: {
    enable: true,
    package: 'egg-sequelize',
  },

};

export default plugin;
