import {Context} from 'egg';

/**
 * 错误处理中间件
 * 捕获 自定义throw error
 * @returns 
 */
export default function errorHandlerMiddleware() {
  return async (ctx: Context, next: any) => {
    try {
      await next();
    } catch (e) {
      ctx.logger.error(e);
      ctx.body = e;
    }
  }
}