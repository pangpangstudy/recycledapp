import { Global, Logger, Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { PrismaModule } from './common/prisma/prisma.module'
import { ListenerModule } from './listener/listener.module'
import { ConfigModule } from '@nestjs/config'
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo'
import { GraphQLModule } from '@nestjs/graphql'
import { join } from 'path'
import { ManufacturersModule } from './models/manufacturers/manufacturers.module'
import { ProductItemsModule } from './models/product-items/product-items.module'
import { ProductsModule } from './models/products/products.module'
import { ToxicItemsModule } from './models/toxic-items/toxic-items.module'
import { TransactionsModule } from './models/transactions/transactions.module'
import { AuthModule } from './auth/auth.module'
import { ResyncModule } from './resync/resync.module'

export const isDEV = process.env.NODE_ENV === 'development'
// const envFilePath = ['.env']
// if (isDEV) {
//   envFilePath.unshift('.env.dev')
// } else {
//   envFilePath.unshift('.env.prod')
// }
@Global()
@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      introspection: true,
    }),
    PrismaModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        '.env',
        process.env.NODE_ENV === 'development'
          ? '.env.development'
          : `.env.${process.env.NODE_ENV}`,
      ],
    }),
    ResyncModule,
    ListenerModule,
    ManufacturersModule,
    ProductItemsModule,
    ProductsModule,
    ToxicItemsModule,
    TransactionsModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService, Logger],
  exports: [Logger],
})
export class AppModule {}
