// 路由参数
export const ROUTE_ARGS_METADATA = Symbol('__routeArguments__');
// 路由handle
export const ROUTE_HANDLE_METADATA = Symbol('__routeHandle__');
// 路由控制器
export const ROUTE_CONTROLLER_METADATA = Symbol('__routeController__');
// 路由方法（http方法）
export const ROUTE_METHOD_METADATA = Symbol('__routeMethod__');
// 路由地址
export const ROUTE_URL_METADATA = Symbol('__routePath__');
// 上传文件
export const UPLOAD_FILE_METADATA = Symbol('__uploadFile__');

export enum ReflectDefaultMetadata {
  // 获取目标成员类型
  DESIGN_TYPE = 'design:type',
  // 获取目标成员参数类型
  DESGIN_PARAMTYPES = 'design:paramtypes',
  // 获取目标成员返回类型
  DESGIN_RETURNTYPE = 'design:returntype',
}

export const enum RouteParamtypesEnum {
  REQUEST = 0,
  RESPONSE = 1,
  BODY = 2,
  QUERY = 3,
  PARAM = 4,
  HEADERS = 5,
  FILE_STREAM = 6,
}
