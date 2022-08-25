import { RouteParamtypesEnum, ROUTE_ARGS_METADATA } from '../../constant';

const assignMetadata = (args, paramtype, index, data, ...pipes) => {
  return {...args,
    [`${paramtype}:${index}`]: {
      paramtype,
      paramIndex: index,
      propName: data,
      pipes,
    }};
};

/**
 * @param {number} paramtype 参数类型
 * @returns 
 */
const createRouteParamDecorator = (paramtype: number) => {
  return (data?: any, ...pipes) => (target, key, index) => {
    const args = Reflect.getMetadata(ROUTE_ARGS_METADATA, target, key) || {};
    Reflect.defineMetadata(
      ROUTE_ARGS_METADATA,
      assignMetadata(args, paramtype, index, data, ...pipes),
      target,
      key,
    );
  };
};

export const Body = (property?: string, ...pipes) => {
  return createRouteParamDecorator(RouteParamtypesEnum.BODY)(property, ...pipes);
};
