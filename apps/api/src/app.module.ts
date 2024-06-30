import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './common/prisma/prisma.module'
import { ListenerModule } from './listener/listener.module'
import { ConfigModule } from '@nestjs/config'
export const isDEV = process.env.NODE_ENV === 'development'
const envFilePath = ['.env']
if (isDEV) {
  envFilePath.unshift('.env.dev')
} else {
  envFilePath.unshift('.env.prod')
}
@Module({
  imports: [
    PrismaModule,
    ListenerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
