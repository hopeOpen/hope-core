import { Application, Context } from 'egg';
import * as path from 'path';
import * as fs from 'fs';
import { ROUTE_ARGS_METADATA, ROUTE_HANDLE_METADATA, 
  ROUTE_CONTROLLER_METADATA, ROUTE_METHOD_METADATA, 
  ROUTE_URL_METADATA, UPLOAD_FILE_METADATA,
  ReflectDefaultMetadata, RouteParamtypesEnum } from './constant';


export interface RouteHandlerInterface {
  methodName: string; // 方法名
  httpMethod: string; // 请求类型
  urlPath: string; // 路由地址
  uploadFile: UploadFileConfigInterface; // 是否上传文件
  handlerArgs: any; // 方法参数数据
}

export interface UploadFileConfigInterface {
  targetDir?: string;
}


export interface RouteMetadataInterface {
  filePath: string; // 文件路径
  url: string; // 路由地址
  handler: RouteHandlerInterface; // 路由handler
  ctrlPrefix: string; // 控制器前缀
}

export class RequestMapping {

  app: Application;
  // 全局路由前缀
  _prefix = '';

  // 路由map
  _routes: Map<string, RouteMetadataInterface> = new Map();

  /**
   * 加载路由
   * @param {Egg.Application} app  app egg应用实例
   * @param {string} dirPath 路由文件路径
   * @param {string} prefix 全局路由前缀
   * @param {string} middleware 中间件
   */
  scanController(app: Application, dirPath = '', prefix = '', middleware = []): void {
    this.app = app;
    // 文件集合 例如 ['/Users/lichunlin/code/hopeOpen/hope-core/app/controller/user/index.ts']
    const files = this.scanDir(dirPath);
    // 路由前缀 例如 /hope-api
    const routePrefix = prefix ? `/${prefix}` : this._prefix || '';

    files.map(file => {
      // controller 实例 例如 [class UserController extends BaseContextClass]
      const controller = require(file).default;
      /**
       * exploreController 解析路由
       * 返回例如
       *  handlers =[{
            urlPath: 'login',
            httpMethod: 'post',
            methodName: 'login',
            handlerArgs: {},
            uploadFile: null
          },....],
          ctrlPrefix = user
       */
      const exploreCtrl = this.exploreController(controller);
      const {handlers, ctrlPrefix} = exploreCtrl;

      // 将:param的参数的路由放在最后面
      // sortHandlers = 同上handlers 值，顺序不同
      const sortHandlers = handlers
        .sort((prev, next) => {
          const reg = new RegExp('[\\s\\S]*:[\\s\\S]*', 'g');
          return +reg.test(prev.urlPath) - +reg.test(next.urlPath);
        });

      sortHandlers.forEach((handler) => {
        const {
          methodName,
          httpMethod,
          urlPath,
          handlerArgs,
          uploadFile,
        } = handler;
        const urls = [routePrefix || '', ctrlPrefix, urlPath];
        // 生成路由地址 例如： /hope-api/user/login， /hope-api/user/logout 。。。
        const url = urls.filter((item, index) => item || index === 0).join('/');
        // 打印路由日志
        this.logRouter(app, httpMethod, url, file, handler, ctrlPrefix);

        // 注册路由
        app.router[httpMethod](url, ...middleware, async (ctx: Context) => {
          const instance = new controller(ctx);
          // 上传文件
          if (uploadFile) {
            // ctx.request.file = await this.getUploadFile(ctx, uploadFile);
          }
          const params: any[] = await this.getRouteParams(ctx, handlerArgs);
          // 调用实例中的方法
          const result = await instance[methodName](...params);
          if (ctx.body === undefined && result !== undefined) {
            ctx.body = result;
          }
        })

      });

    });

  }

  /**
   * 获取文件夹下所有文件
   * @param dir controller下模块名称
   * @return [] 文件路径集合
   */
  scanDir(dir = '') {
    const appDir = this.remove(__dirname, 'app');
    if (!path.isAbsolute(dir)) {
      dir = path.join(appDir, 'app/controller', dir);
    }

    if (!fs.existsSync(dir)) {
      console.error(`Can not find directory: ${dir}`);
    }

    // 获取文件夹下所有文件 例如 ['index.ts']
    const files = fs.readdirSync(dir);

    let result: string[] = [];
    files.forEach(file => {
      /**
       * 获取文件完整路径 例如
       * /Users/lichunlin/code/hopeOpen/hope-core/app/controller/user/index.ts
       */
      const filePath = path.join(dir, file);
      /**
       * fs.statSync 获取文件信息状态
       */
      const stat = fs.statSync(filePath);
      // 判断是否是文件夹
      if (stat.isDirectory()) {
        result = [ ...result, ...this.scanDir(filePath) ];
      } else if (stat.isFile()) { // 是否为文件
        if (this.app.config.env !== 'local' && /.js/.test(filePath)) {
          result.push(filePath);
        } else if (this.app.config.env === 'local') {
          result.push(filePath);
        }
      }
    });
    return result;
  }

  /**
   * 删除路径
   * @param src 原路径
   * @param st 文件夹 默认app
   * @return  /Users/lichunlin/code/hopeOpen/hope-core/ app文件夹之前的文件路径
   */
  remove(src: string, st: string): string {
    const index = src.indexOf(st);
    if (index >= 0) {
      return src.substring(0, index);
    }
    return src;
  }

  /**
   * 解析controller 获取
   * @param controller
   */
  exploreController(controller: any) {
  // 原型 例如 UserController
  const prototype = controller.prototype;
  // 构造函数  controller === constructor => true
  const constructor = prototype.constructor;
  /**
   * 函数 方法、属性装饰器，传入原型
   * 例如：methodNames = ['login','logout','addUsers','users','checkName','userInfo','updateUser','deleteUser']
   */
  const methodNames = Reflect.getMetadata(ROUTE_HANDLE_METADATA, prototype) || [];
  
  /**
   * 控制器前缀 类装饰器，传入的是构造函数
   * ctrlPrefix = ['login','logout','addUsers','users','checkName','userInfo','updateUser','deleteUser']
   */
  const ctrlPrefix = Reflect.getMetadata(ROUTE_CONTROLLER_METADATA, constructor) || '';
  
  const handlers: RouteHandlerInterface[] = [];
  methodNames.forEach((methodName) => {
    // 获取http方法 例如 post
    const httpMethod: string = Reflect.getMetadata(ROUTE_METHOD_METADATA, prototype, methodName);
    
    // 方法装饰器声明的路由 例如 login
    const urlPath: string = Reflect.getMetadata(ROUTE_URL_METADATA, prototype, methodName) || '';
    
    // 是否上传文件
    const uploadFile = Reflect.getMetadata(UPLOAD_FILE_METADATA, prototype, methodName) || null;
    
    // handler的参数
    const handlerArgs: RouteHandlerInterface = Reflect.getMetadata(
      ROUTE_ARGS_METADATA,
      prototype,
      methodName,
    ) || {};
    // handlerArgs的参数类型
    const handlerArgsTypes: any[] = Reflect.getMetadata(
      ReflectDefaultMetadata.DESGIN_PARAMTYPES,
      prototype,
      methodName,
    );
    for (const key of Object.keys(handlerArgs)) {
      const {paramIndex} = handlerArgs[key];
      // 相应位置的参数类型。类型声明
      handlerArgs[key].type = handlerArgsTypes[paramIndex];
    }
    handlers.push({
      urlPath,
      httpMethod,
      methodName,
      handlerArgs,
      uploadFile,
    });
  });
  return {
    handlers,
    ctrlPrefix,
  };
  }


  /**
   * 打印路由日志
   * @param {"egg".Application} app
   * @param httpMethod 请求方法
   * @param url 路由地址
   * @param file 控制器文件路径
  //  * @param methodName 方法名
   * @param handler 解析controller获取的数据
   * @param ctrlPrefix 控制器前缀
   */
  logRouter(app: Application, httpMethod, url, file, handler, ctrlPrefix) {
    const routeKey = `[${httpMethod}]:${url}`;
    if (this._routes.has(routeKey)) {
      // 路由重复
      app.emit('error', `[route]${routeKey} already exists.`);
    }
    this._routes.set(routeKey, {
      filePath: file,
      url,
      handler,
      ctrlPrefix,
    });
  }

  async getUploadFile() {
  // async getUploadFile(ctx: Context, uploadConfig: UploadFileConfigInterface) {
    // const fileStream = await ctx.getFileStream();
    // const ext = path.extname(fileStream.filename);
    // const keyName = `${ctx.businessId}-${uuid.v1()}${ext}`;
    // const targetDir = uploadConfig.targetDir || '';
    // const filepath = await ctx.move2Local(keyName, targetDir, fileStream);
    //   // 保存到本地
    // return {
    //   filepath,
    //   ...JSON.parse(JSON.stringify(fileStream)),
    // };
  }

  /**
   * 获取参数
   * @param {"egg".Context} ctx
   * @param {} handlerArgs
   */
  getRouteParams(ctx: Context, handlerArgs: any) {
    const params: any[] = [];
    for (const key of Object.keys(handlerArgs)) {
      const {
        paramIndex,
        paramtype,
        propName,
      } = handlerArgs[key];
      let param: any;
      switch (paramtype) {
        case RouteParamtypesEnum.REQUEST:
          param = ctx.request;
          break;
        case RouteParamtypesEnum.RESPONSE:
          param = ctx.response;
          break;
        case RouteParamtypesEnum.BODY:
          param = propName ? ctx.request.body[propName] : ctx.request.body;
          break;
        case RouteParamtypesEnum.QUERY:
          param = propName ? ctx.request.query[propName] : ctx.request.query;
          break;
        case RouteParamtypesEnum.PARAM:
          param = propName ? ctx.params[propName] : ctx.params;
          break;
        case RouteParamtypesEnum.HEADERS:
          param = propName ? ctx.request.headers[propName] : ctx.request.headers;
          break;
          // TODO: 暂时不对文件处理
        case RouteParamtypesEnum.FILE_STREAM:
          // const fileStream = await ctx.getFileStream();
          // param = fileStream;
          break;
        default:
          break;
      }
      params[paramIndex] = param;
    }
    return params;
  }

}
