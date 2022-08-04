
import { ROUTE_HANDLE_METADATA, ROUTE_METHOD_METADATA, ROUTE_URL_METADATA, ROUTE_CONTROLLER_METADATA } from '../../constant';

/**
 * 创建http方法装饰器
 * @param methodtype http method
 * @returns 
 */
const createHttpMethodDecorator = (methodtype) => {
  return (path:string = '') => {
    /**
     * @param {Function} target 目标类
     * @param {string} propertyKey 目标类的方法名
     * @param {number} descriptor 目标类的方法描述
     *  descriptor = { value: [Function], enumerable: true, writable: true, configurable: true }
     */
    return (target, propertyKey) => {
      // 获取实例中target的ROUTE_HANDLE_METADATA元数据
      const handlers = Reflect.getMetadata(ROUTE_HANDLE_METADATA, target) || [];
      handlers.push(propertyKey);
      // 设置实例中target的ROUTE_HANDLE_METADATA 设置元数据 = handlers
      Reflect.defineMetadata(ROUTE_HANDLE_METADATA, handlers, target);
      // 设置实例中target的ROUTE_METHOD_METADATA元数据 设置methodtype方法
      // 例如 Reflect.defineMetadata(__routeHandle__, post, UserController, addUsers);
      Reflect.defineMetadata(ROUTE_METHOD_METADATA, methodtype, target, propertyKey);
      // 设置实例中target的ROUTE_URL_METADATA元数据 设置path路径
      // 例如 Reflect.defineMetadata(__routePath__, add-users, UserController, addUsers);
      Reflect.defineMetadata(ROUTE_URL_METADATA, path, target, propertyKey);
    }
  }
}

// 向外抛出 post/Put/Get/Delete 装饰器
export const Post = createHttpMethodDecorator('post');
export const Put = createHttpMethodDecorator('put');
export const Get = createHttpMethodDecorator('get');
export const Delete = createHttpMethodDecorator('delete');

// 设置控制器
export const Control = (prefix: string = '') => {
  return (target: any) => {
    Reflect.defineMetadata(ROUTE_CONTROLLER_METADATA, prefix, target);
  };
};
