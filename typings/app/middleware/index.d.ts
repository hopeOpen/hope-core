// This file is created by egg-ts-helper@1.33.0
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportErrorHandler from '../../../app/middleware/errorHandler';
import ExportJwt from '../../../app/middleware/jwt';
import ExportLog from '../../../app/middleware/log';
import ExportResponseFormat from '../../../app/middleware/responseFormat';

declare module 'egg' {
  interface IMiddleware {
    errorHandler: typeof ExportErrorHandler;
    jwt: typeof ExportJwt;
    log: typeof ExportLog;
    responseFormat: typeof ExportResponseFormat;
  }
}
