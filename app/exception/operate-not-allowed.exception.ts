import {HttpException} from './http.exception';
import {HttpStatus} from './http-status.enum';
/**
 * 常规不可操作异常
 */
export class OperationNotAllowedException extends HttpException {
  constructor(message?: string, res?: any, status?: number) {
    super(message || 'operation not allowed', status || HttpStatus.FORBIDDEN, res);
    this.name = 'OperationNotAllowedException';
  }
}
