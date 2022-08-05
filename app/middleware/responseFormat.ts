import { Context } from 'egg';

/**
 * 格式化请求结果
 * @return {(ctx: "egg".Context, next: any) => Promise<void>}
 * @class
 */
export default function ResponseFormatMiddleware() {
  return async (ctx: Context, next: any) => {
    await next();
    // 异常捕获
    if(!ctx.body) {
      ctx.body = {
        code: 500,
        message: '服务器错误'
      };
    } else if(ctx.body.__proto__ == TypeError.prototype || ctx.body.__proto__ == Error.prototype) {
      ctx.body = {
        code: 500,
        // message: ctx.body.message,
        message: '服务器错误',
      };
    } else if (ctx.body !== undefined && !ctx.noResponseFormat) {
      ctx.status = ctx.status === 204 ? 200 : ctx.status;
      ctx.body = {
        code: ctx.STATUS_CODE || 200,
        data: ctx.body,
        message: 'success',
      };
    }
  };
}
