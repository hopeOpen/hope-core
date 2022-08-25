
import { AuthenticationFailedException } from '../exception/authenticationFailed.exception';
import { HttpStatus } from '../exception/httpStatus.enum';
import { Context } from 'egg';

const throwError = (ctx: Context, message: string) => {
  ctx.STATUS_CODE = HttpStatus.UNAUTHORIZED
  throw new AuthenticationFailedException(message);
}

module.exports = () => {
  return async function jwt(ctx, next) {
    const { app: {config: { apiPrefix, tokenField }}, request, app } = ctx;
    // 白名单
    const whiteList = [
      // 登陆
      `/${apiPrefix}/user/login`
    ];
    // 白名单跳过
    if(whiteList.some(item=> item === request.url)) {
      await next();
    } else {
      // 拿到传会数据的header 中的token值
      // const token = request.header[tokenField];
      const token = ctx.cookies.get(tokenField, {
        // 获取加密的cookie,要加上{encrypt:true}
        encrypt: true
      });
      if (!token) {
        throwError(ctx, '未登录， 请先登录');
      } else { // 当前token值存在
        // 解码token
        const decode = await ctx.app.jwt.verify(token, app.config.jwt.secret, (err, decoded) => {
          if (err) {
            if (err.name === 'TokenExpiredError') { // token过期
              return 'TokenExpiredError';
            } else if (err.name === 'JsonWebTokenError') { // 无效的token
              return 'JsonWebTokenError';
            }
          } else {
            return decoded;
          }
        });

        if (decode === 'TokenExpiredError') {
          throwError(ctx, '登录过期, 请重新登录');
        }

        if (decode === 'JsonWebTokenError') {
          throwError(ctx, '凭证无效, 请重新登录');
        }
        await next();
      }
    }
  };
};

