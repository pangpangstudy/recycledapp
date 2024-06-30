import {
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston'
import * as winston from 'winston'
const timeZone = 'Asia/Shanghai'
const timestampFormat = () => {
  return new Date().toLocaleString('zh-CN', { timeZone: timeZone })
}
export const winstonConfig: WinstonModuleOptions = {
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        nestWinstonModuleUtilities.format.nestLike('NestJS', {
          prettyPrint: true,
        }),
      ),
    }),
  ],
}
