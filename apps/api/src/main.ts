import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'

import { WinstonModule } from 'nest-winston'
import { instance } from './config/winstonConfig'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance,
    }),
  })
  // app.setGlobalPrefix('api/v1')
  await app.listen(3000)
}
bootstrap()
