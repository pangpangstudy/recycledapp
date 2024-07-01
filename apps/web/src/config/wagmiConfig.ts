import { connectorsForWallets, getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  coinbaseWallet,
  metaMaskWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets'
import { cookieStorage, createConfig, createStorage, http } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID
if (!projectId) throw new Error('Project ID is not defined')
const isClient = typeof window === 'undefined' ? true : false
const connectors = !isClient
  ? connectorsForWallets(
      [
        {
          groupName: 'Recommended',
          wallets: [
            rainbowWallet,
            metaMaskWallet,
            coinbaseWallet,
            walletConnectWallet,
          ],
        },
      ],
      { appName: 'Ticket', projectId: projectId },
    )
  : []
export const config = createConfig({
  chains: [polygonAmoy],
  connectors,
  ssr: true,
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [polygonAmoy.id]: http(),
  },
})
