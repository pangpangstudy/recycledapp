import { createPublicClient, fallback, http } from 'viem'
import { polygonAmoy } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: fallback([http(process.env.NEXT_PUBLIC_HTTPS_RPC!), http()]),
})
