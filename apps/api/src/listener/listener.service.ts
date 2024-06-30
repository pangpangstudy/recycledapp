import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common'
import { EventLog, ethers } from 'ethers'
import { RecycleChain, RecycleChain__factory } from '../common/typechain-types'
import { contractAddress } from 'src/common/utils'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { ProductStatus } from '@prisma/client'
const statusMapping = [
  ProductStatus.MANUFACTURED,
  ProductStatus.SOLD,
  ProductStatus.RETURNED,
  ProductStatus.RECYCLED,
]
//  如果使用viem 也是差不多 1.createPublicClient（wss） 2. getContract .watchEvent
@Injectable()
export class ListenerService implements OnModuleInit, OnModuleDestroy {
  private provider: ethers.WebSocketProvider
  private contract: RecycleChain

  constructor(
    private readonly prisma: PrismaService,
    private logger: Logger,
  ) {}
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
    ///////////////////////
    // Manufacturer Event//
    ///////////////////////
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
        async (id, name, location, contact, event) => {
          // @ts-expect-error  这里是ethers的ts类型处理问题
          const eventLog: EventLog = event.log
          const transactionHash = eventLog.transactionHash
          const blockNumber = eventLog.blockNumber
          const timestamp = await this.getBlockTime(blockNumber)
          await this.createManufacturer({
            contact,
            id,
            location,
            name,
            timestamp,
          })
          this.logger.log(
            `Manufacturer_${transactionHash}:${id} ${name} ${location} ${contact} ${timestamp}`,
          )
        },
      )
    } catch (error) {
      console.log(error)
      this.logger.error(`监听Manufacturer事件报错：${error.message}`)
    }
    /////////////////////////
    // ProductCreated Event//
    ////////////////////////
    try {
      this.contract.on(
        this.contract.filters.ProductCreated,
        async (productId, name, manufacturer, event) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error  这里是ethers的ts类型处理问题
          const blockNumber = event.log.blockNumber
          const timestamp = await this.getBlockTime(blockNumber)

          await this.createProduct({
            manufacturer,
            name,
            productId: productId.toString(),
            timestamp,
          })
          this.logger.log(
            'Event: ProductCreated--',
            productId,
            name,
            manufacturer,
            event,
          )
        },
      )
    } catch (error) {
      console.error('Event: ProductCreated: Listener setup failed.', error)
      this.logger.error(`Event: ProductCreated:报错：${error.message}`)
    }
    ////////////////////////////
    // ProductItemsAdded Event//
    ///////////////////////////
    try {
      this.contract.on(
        this.contract.filters.ProductItemsAdded,
        async (productItemIds, productId, event) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          const timestamp = await this.getBlockTime(
            // @ts-expect-error  这里是ethers的ts类型处理问题
            event.log.blockNumber,
          )

          const items = await this.createProductItems({
            productId: productId.toString(),
            productItemIds,
            timestamp,
          })

          console.log('items', items)
          this.logger.log(
            'Event: ProductItemsAdded--',
            productItemIds,
            productId,
            timestamp,
          )
        },
      )
      console.log('Event: ProductItemsAdded Listening...')
    } catch (error) {
      console.error('Event: ProductItemsAdded: Listener setup failed.', error)
      this.logger.error(`监听ProductItemsAdded事件报错：${error.message}`)
    }
    try {
      this.contract.on(
        this.contract.filters.ProductItemsAdded,
        async (productItemIds, productId, event) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const timestamp = await this.getBlockTime(event.log.blockNumber)

          const items = await this.createProductItems({
            productId: productId.toString(),
            productItemIds,
            timestamp,
          })

          console.log('items', items)
          this.logger.log('Event: ProductItemsAdded--', items)
        },
      )
      console.log('Event: ProductItemsAdded Listening...')
    } catch (error) {
      console.error('Event: ProductItemsAdded: Listener setup failed.', error)
      this.logger.error(`监听ProductItemsAdded事件报错：${error.message}`)
    }
    try {
      this.contract.on(
        this.contract.filters.ProductItemsStatusChanged,
        async (productItemIds, statusIndex, event) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const timestamp = await this.getBlockTime(event.log.blockNumber)

          await this.updateProductItemStatus({
            productItemIds,
            statusIndex: +statusIndex.toString(),
            timestamp,
          })
          this.logger.log(
            'Event: ProductItemsStatusChanged--',
            productItemIds,
            +statusIndex.toString(),
            timestamp,
          )
        },
      )
      console.log('Event: ProductItemsStatusChanged Listening...')
    } catch (error) {
      console.error(
        'Event: ProductItemsStatusChanged: Listener setup failed.',
        error,
      )
      this.logger.error(
        `监听ProductItemsStatusChanged事件报错：${error.message}`,
      )
    }
    try {
      this.contract.on(
        this.contract.filters.ToxicItemCreated,
        async (productId, name, weight, event) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          const timestamp = await this.getBlockTime(event.log.blockNumber)

          await this.createToxicItem({
            name,
            productId: productId.toString(),
            weight: Number(weight.toString()),
            timestamp,
          })
        },
      )
      console.log('Event: ToxicItemCreated Listening...')
    } catch (error) {
      console.error('Event: ToxicItemCreated: Listener setup failed.', error)
    }
  }
  // 同步数据
  async resyncBlockchainData() {
    if (!this.contract) {
      throw new Error('Contract is not initialized')
    }

    const fromBlock = 8890592
    const toBlock = 'latest'

    // 1. ManufacturerRegistered events

    const manufacturerRegisteredEvents = await this.contract.queryFilter(
      this.contract.filters.ManufacturerRegistered,
      fromBlock,
      toBlock,
    )

    for (const event of manufacturerRegisteredEvents) {
      const [id, name, location, contact] = event.args
      const timestamp = await this.getBlockTime(event.blockNumber)

      await this.createManufacturer({
        contact,
        id,
        location,
        name,
        timestamp,
      })
    }

    //   2. ProductCreated events

    const productCreatedEvents = await this.contract.queryFilter(
      this.contract.filters.ProductCreated,
      fromBlock,
      toBlock,
    )

    for (const event of productCreatedEvents) {
      const [productId, name, manufacturer] = event.args
      const timestamp = await this.getBlockTime(event.blockNumber)

      await this.createProduct({
        manufacturer,
        name,
        productId: productId.toString(),
        timestamp,
      })
    }

    // Query and handle ProductItemsAdded events
    const productItemsAddedEvents = await this.contract.queryFilter(
      this.contract.filters.ProductItemsAdded,
      fromBlock,
      toBlock,
    )
    for (const event of productItemsAddedEvents) {
      const [productItemIds, productId] = event.args
      const timestamp = await this.getBlockTime(event.blockNumber)

      await this.createProductItems({
        productId: productId.toString(),
        productItemIds,
        timestamp,
      })
    }

    // Query and handle ProductItemsStatusChanged events
    const productItemsStatusChangedEvents = await this.contract.queryFilter(
      this.contract.filters.ProductItemsStatusChanged,
      fromBlock,
      toBlock,
    )

    for (const event of productItemsStatusChangedEvents) {
      const [productItemIds, statusIndex] = event.args
      const timestamp = await this.getBlockTime(event.blockNumber)

      await this.updateProductItemStatus({
        productItemIds,
        statusIndex: +statusIndex.toString(),
        timestamp,
      })
    }

    // Query and handle ToxicItemCreated events
    const toxicItemCreatedEvents = await this.contract.queryFilter(
      this.contract.filters.ToxicItemCreated(),
      fromBlock,
      toBlock,
    )
    for (const event of toxicItemCreatedEvents) {
      const [productId, name, weight] = event.args
      const timestamp = await this.getBlockTime(event.blockNumber)

      await this.createToxicItem({
        name,
        productId: productId.toString(),
        weight: +weight.toString(),
        timestamp,
      })
    }
  }
  async getBlockTime(blockNumber: number): Promise<Date> {
    const block = await this.provider.getBlock(blockNumber)
    return new Date(block.timestamp * 1000)
  }
  /////////////
  // DB WRITE//
  ////////////

  private async createManufacturer({
    id,
    name,
    location,
    contact,
    timestamp,
  }: {
    id: string
    name: string
    location: string
    contact: string
    timestamp: Date
  }) {
    const manufacturer = await this.prisma.manufacturer.create({
      data: {
        id,
        timestamp,
        contact,
        location,
        name,
      },
    })
    console.log('Manufacturer created: ', manufacturer)
  }
  private async createProduct({
    manufacturer,
    name,
    productId,
    timestamp,
  }: {
    manufacturer: string
    name: string
    productId: string
    timestamp: Date
  }) {
    const product = await this.prisma.product.create({
      data: {
        id: productId.toString(),
        name,
        timestamp,
        manufacturer: {
          connect: {
            id: manufacturer,
          },
        },
      },
    })
    console.log('Product created: ', product)
    this.logger.log(
      'Product created: ',
      manufacturer,
      name,
      productId,
      timestamp,
    )
  }
  private createProductItems({
    productId,
    productItemIds,
    timestamp,
  }: {
    productItemIds: string[]
    productId: string
    timestamp: Date
  }) {
    // 返回一系列 prisma 数据库操作函数
    const transactions = productItemIds.map((productItemId) => {
      return this.prisma.transaction.create({
        data: {
          status: ProductStatus.MANUFACTURED,
          productItemId,
          timestamp,
        },
      })
    })
    const productItemUpdates = this.prisma.productItem.createMany({
      data: productItemIds.map((id) => ({
        id,
        productId: productId.toString(),
        status: ProductStatus.MANUFACTURED,
        timestamp,
      })),
    })
    // 通过$transaction 事务来执行  利用事务的原子性
    return this.prisma.$transaction([productItemUpdates, ...transactions])
  }
  private updateProductItemStatus({
    statusIndex,
    productItemIds,
    timestamp,
  }: {
    statusIndex: number
    productItemIds: string[]
    timestamp: Date
  }) {
    const status = statusMapping[+statusIndex.toString()] as ProductStatus

    const transactions = productItemIds.map((productItemId) => {
      return this.prisma.transaction.create({
        data: {
          status,
          productItemId,
          timestamp,
        },
      })
    })

    const productItemUpdates = this.prisma.productItem.updateMany({
      data: { status, timestamp },
      where: { id: { in: productItemIds } },
    })

    return this.prisma.$transaction([productItemUpdates, ...transactions])
  }
  // 事件是接连得发出的，所以非常快，可能会存在当createToxicItem事件来的时候，prisma还没有即使将project给写入数据库
  // 所以需要重试机制，只在product存在得时候进行插入
  private async createToxicItem({
    productId,
    name,
    weight,
    timestamp,
  }: {
    productId: string
    name: string
    weight: number
    timestamp: Date
  }) {
    const maxRetries = 5
    let retryCount = 0
    const delay = (ms: number) =>
      new Promise((resolve) => setTimeout(resolve, ms))

    while (retryCount < maxRetries) {
      const product = await this.prisma.product.findUnique({
        where: {
          id: productId,
        },
      })
      console.log('project存在嘛？', !!product)
      if (product) {
        const toxicItem = await this.prisma.toxicItem.create({
          data: {
            name,
            weight,
            productId,
            timestamp,
          },
        })
        console.log('Toxic item created: ', toxicItem)
        return
      } else {
        console.error(
          `Product with ID ${productId} not found. Retrying (${retryCount + 1}/${maxRetries})...`,
        )
        await delay(1000) // Wait for 1 second before retrying
        retryCount++
      }
    }
  }
}
