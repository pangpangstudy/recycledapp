import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { ethers } from 'ethers'
import { RecycleChain, RecycleChain__factory } from '../common/typechain-types'
import { contractAddress } from 'src/common/utils'
import { PrismaService } from 'src/common/prisma/prisma.service'
@Injectable()
export class ListenerService implements OnModuleInit, OnModuleDestroy {
  private provider: ethers.WebSocketProvider
  private contract: RecycleChain

  constructor(private readonly prisma: PrismaService) {}
  onModuleInit() {
    this.initializeWebSocketProvider()
    this.subscribeToEvents()
  }
  onModuleDestroy() {
    //    移除所有监听
    this.cleanUp()
  }

  initializeWebSocketProvider() {
    const rpc = process.env.RPC!
    this.provider = new ethers.WebSocketProvider(rpc)
    this.contract = RecycleChain__factory.connect(
      contractAddress,
      this.provider,
    )
  }
  cleanUp() {
    this.provider.removeAllListeners()
  }
  subscribeToEvents() {
    try {
      // 这里是过滤事件
      // this.contract
      //   .queryFilter(this.contract.filters.ManufacturerRegistered())
      //   .then((events) => {
      //     events.forEach((event) => {
      //       console.log(event)
      //     })
      //   })
      // 这里是监听事件  只会返回未来的事件
      this.contract.on(
        this.contract.filters.ManufacturerRegistered,
        async (manufacture, name, location, contact, event) => {
          // @ts-expect-error  这里是ethers的ts类型处理问题
          const blockNumber = event.log.blockNumber
          const timestamp = await this.getBlockTime(blockNumber)
          await this.prisma.manufacturer.create({
            data: { id: manufacture, name, location, contact, timestamp },
          })
        },
      )
    } catch (error) {
      console.log(error)
    }
  }
  async getBlockTime(blockNumber: number): Promise<Date> {
    const block = await this.provider.getBlock(blockNumber)
    return new Date(block.timestamp * 1000)
  }
}
