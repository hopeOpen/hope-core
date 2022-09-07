import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg';
import { Op } from 'sequelize';
import * as path from 'path';
import * as dotenv from 'dotenv';

// 加载环境变量
const envConfig = dotenv.config({
  path: path.resolve(__dirname, '../.env'), // 配置文件路径
  encoding: 'utf8', // 编码方式，默认utf8
  debug: false, // 是否开启debug，默认false
}).parsed;

if (!envConfig) {
  // 抛出错误 退出程序
  throw new Error("Can't load .env file");
}

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>;

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1652613572474_490';

  // add your egg config in here
  config.middleware = [];

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  };

  config.static = {
    alias: {
      '@root': '../',
      '@': path.join(__dirname, '../app'),
    },
  };

  config.cluster = {
    listen: {
      port: 8619,
      hostname: 'localhost',
    }
  };

  // 自定义 token 的加密条件字符串
  config.jwt = {
    secret: process.env.JWT_SECRET,
    // 默认是关闭，如果开启，这会对所有请求进行自动校验；限定请求，请设置match做路径匹配
    // enable: true,
    match: /^\/api/, // 匹配的请求，会走jwt校验，否则忽略；例如登录接口需要被忽略；
    // jwt.sign(***,***,[options,***])方法中，options的默认设置可以在这里配置；
    sign: {
      // 多少s后过期。actionToken.js中,jwt.sing(plyload,secret,{expiresIn:number})会被合并，调用时设置优先级更高;
      expiresIn: process.env.JWT_EXPIRES || 60 * 10 ,
    },
  };

  // 跨域配置
  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  };

  config.security = {
    csrf: {
      enable: false,
    },
    // 允许访问接口的白名单
    domainWhiteList: [ '*' ],
  };
  
  /* 连接mysql配置 */
  config.sequelize = {
    // 数据库类型
    dialect: 'mysql',
    host: process.env.DB_HOST,
    // 本地密码1234
    // host: 'localhost',
    // 端口
    port: +(process.env.DB_PORT || 3306),
    // 数据库
    database: process.env.DB_NAME,
    // 用户名
    username: process.env.DB_USER,
    // 密码
    password: process.env.DB_PASSWORD,
    timezone: '+08:00', // 更改为北京时区
    // 【可选】加载所有的模型models到 `app[delegate]` and `ctx[delegate]`对象中，进行委托, 默认是model
    // delegate: '',
    // 【可选】加载 `app/${baseDir}`文件夹下的所有js文件作为models,默认为 `model`
    // baseDir: '',
    // 【可选】加载所有模型models时，忽略 `app/${baseDir}/index.js` 文件，支持文件路径和数组
    // exclude: '',
    define: {
      // 表名是否和model的js文件名一致
      freezeTableName: false,
      underscored: true,
    },
    operatorsAliases: {
      $link: Op.like,
    },
  };

  config.logger = {
    level: 'DEBUG',
    outputJSON: true,
    encoding: 'utf-8',
    consoleLevel: 'DEBUG',
  };

  // 默认执行中间件 右往左
  config.middleware = [
    'log', 'responseFormat', 'errorHandler'
  ]

  // api 前缀
  config.apiPrefix = process.env.API_PREFIX || 'hope-api';
  // token字段
  config.tokenField = process.env.TOKEN_PREFIX || 'hope_token';

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  };
};
