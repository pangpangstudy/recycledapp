import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { WinstonModule } from 'nest-winston'
import { instance } from './config/winstonConfig'
import * as session from 'express-session'
import { ConfigService } from '@nestjs/config'
import { ValidationPipe } from '@nestjs/common'
import { AuthGuard } from './auth/auth.guard'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  })
  const configService = app.get(ConfigService)
  const secret = configService.get<string>('SECRET')
  app.useGlobalPipes(new ValidationPipe())

  app.enableCors({
    origin: configService.get<string>('FRONTEND_URL'),
    credentials: true,
  })
  // app.setGlobalPrefix('api/v1')
  app.use(
    session({
      name: 'siwe',
      secret: secret,
      resave: true,
      saveUninitialized: true,
      cookie: { secure: false, sameSite: true },
    }),
  )

  await app.listen(3000)
}
bootstrap()
