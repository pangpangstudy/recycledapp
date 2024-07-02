import { IconPlant } from '@tabler/icons-react'
import ScrollText from './ScrollText'
export const PlantIcon = () => {
  return (
    <div className="flex items-center justify-center w-8 h-8 rounded-full shadow-lg cursor-pointer via-transparent bg-gradient-to-t from-green-50 to-transparent shadow-black/30">
      <IconPlant />
    </div>
  )
}
export interface ILogoProps {}

export const Logo = ({}: ILogoProps) => {
  return (
    <div className="relative flex items-center gap-2">
      <PlantIcon />

      <div className="z-10 text-xl font-semibold ">
        <div>Recycle Chain</div>
        <div className="text-xs text-gray">Karthick Ragavendran</div>
      </div>

      <div className="absolute top-0 z-20 px-1 mb-4 -translate-x-1 -translate-y-1/2 left-full">
        <ScrollText
          items={[
            'Web3',
            'Dapp',
            'Decentralized',
            'Trustless',
            'Permissionless',
            'On-chain',
            'Blockchain',
            'Smart Contract Driven',
            'Crypto-powered',
            'Distributed Ledger Technology',
          ]}
          className="px-2 text-xs font-semibold text-black border border-white rounded  shadow-xl  bg-white/30  whitespace-nowrap"
        />
      </div>
    </div>
  )
}
