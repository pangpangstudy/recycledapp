import {
  Controller,
  ForbiddenException,
  Headers,
  InternalServerErrorException,
  Logger,
  Post,
} from '@nestjs/common'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { ListenerService } from 'src/listener/listener.service'

@Controller('resync')
export class ResyncController {
  private logger = new Logger()
  constructor(
    private readonly prisma: PrismaService,
    private listenerService: ListenerService,
  ) {}

  @Post()
  async resyncBlockchainData(@Headers('x-api-secret') apiSecret: string) {
    console.log(process.env.API_SECRET)

    if (apiSecret !== process.env.API_SECRET) {
      throw new ForbiddenException()
    }
    try {
      // Delete all tables data
      await this.prisma.transaction.deleteMany()
      await this.prisma.productItem.deleteMany()
      await this.prisma.toxicItem.deleteMany()
      await this.prisma.product.deleteMany()
      await this.prisma.manufacturer.deleteMany()
      console.log('All tables cleared.')

      await this.listenerService.resyncBlockchainData()
      this.logger.log('All tables cleared.')
      return { message: 'Database reset successfully.' }
    } catch (error) {
      console.error('Error resetting the database:', error)
      this.logger.error('Error resetting the database:', error)
      throw new InternalServerErrorException()
    }
    return 'Resyncing DB'
  }
}
