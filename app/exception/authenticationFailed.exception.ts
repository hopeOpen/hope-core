import {HttpException} from './http.exception';
import {HttpStatus} from './httpStatus.enum';

/**
 * 鉴权失败错误
 */
export class AuthenticationFailedException extends HttpException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
    this.name = 'AuthenticationFailedException';
  }
}
