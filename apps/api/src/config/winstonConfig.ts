import {
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston'
import * as winston from 'winston'
import * as DailyRotateFile from 'winston-daily-rotate-file'
const timeZone = 'Asia/Shanghai'
const timestampFormat = () => {
  return new Date().toLocaleString('zh-CN', { timeZone: timeZone })
}
export const instance = winston.createLogger({
  transports: [
    // new winston.transports.Console({
    //   format: winston.format.combine(
    //     winston.format.timestamp({ format: timestampFormat }),
    //     nestWinstonModuleUtilities.format.nestLike('NestJS', {
    //       prettyPrint: true,
    //     }),
    //   ),
    // }),
    new winston.transports.Console({
      level: 'info',
      // 字符串拼接
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike(),
      ),
    }),
    new DailyRotateFile({
      filename: './logs/%DATE%_error.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // 是否压缩旧文件
      maxSize: '20m',
      maxFiles: '14d', // 保留最近14天的日志
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
    }),
    new DailyRotateFile({
      filename: './logs/%DATE%_info.log',
      datePattern: 'YYYY-MM-DD',
      zippedArchive: true, // 是否压缩旧文件
      maxSize: '20m',
      maxFiles: '14d', // 保留最近14天的日志
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: timestampFormat }),
        winston.format.printf(
          (info) => `${info.timestamp} ${info.level}: ${info.message}`,
        ),
      ),
    }),
  ],
})
