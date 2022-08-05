import { Context } from 'egg';

declare module 'egg' {
  interface Context {
    traceId: string; // 请求链 ID
  }
}

/**
 * 记录请求日志
 * @return {(ctx: "egg".Context, next: any) => Promise<void>}
 * @class
 */
export default function LogMiddleware() {
  return async (ctx: Context, next: any) => {
    const startTime = Date.now();
    // 请求日志
    ctx.logger.info('[request] args: %s', JSON.stringify(ctx.request.body));
    await next();
    // 请求结束日志
    ctx.logger.info(
      '[response] end, status: %s, cost: %s, res: %s',
      ctx.response.status, `${Date.now() - startTime}s`,
      ctx.response.body ? `${JSON.stringify(ctx.response.body).substring(0, 1000)}...` : ctx.response.body, // 截取1000个字符
    );
    console.log('\n')
  };
}
