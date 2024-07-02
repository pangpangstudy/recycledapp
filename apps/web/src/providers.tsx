'use client'

import * as React from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from './config/wagmiConfig'
import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'
import { useEffect, useState } from 'react'
const queryClient = new QueryClient()
const apolloClient = new ApolloClient({
  uri: process.env.NEXT_PUBLIC_API_URL + '/graphql',
  cache: new InMemoryCache(),
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return null

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ApolloProvider client={apolloClient}>
          <RainbowKitProvider>{children}</RainbowKitProvider>
        </ApolloProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
