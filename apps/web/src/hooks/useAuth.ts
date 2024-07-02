import { useEffect } from 'react'
import { SiweMessage } from 'siwe'
import { useAccount, useDisconnect, useSignMessage } from 'wagmi'

export const useAuth = () => {
  const { isConnected, address, connector } = useAccount()
  const { disconnectAsync } = useDisconnect()
  const { signMessageAsync } = useSignMessage()
  useEffect(() => {
    if (!!isConnected && !!address && !!connector && !!connector.getChainId) {
      handleLogin()
    }
  }, [address])

  const handleLogin = async () => {
    try {
      const isAuth = await fetch('http://localhost:3000/auth/authStatus', {
        credentials: 'include',
      })
      const res = await isAuth.json()

      if (res.address && res.address.length > 0) {
        return
      }

      const nonce = await fetch('http://localhost:3000/auth/nonce', {
        credentials: 'include',
      })

      if (nonce) {
        // 获取 chainId
        const chainId = await connector!.getChainId()

        const initMessage = new SiweMessage({
          domain: window.location.host,
          address,
          statement: 'xxxxx',
          uri: window.location.origin,
          version: '1',
          chainId: chainId,
          nonce: await nonce.text(),
        })

        const message = initMessage.prepareMessage()

        const signature = await signMessageAsync({ message })

        await fetch('http://localhost:3000/auth/verify', {
          headers: {
            'Content-Type': 'application/json', // 设置 Content-Type
          },
          method: 'POST',
          body: JSON.stringify({ message, signature }),
          credentials: 'include',
        })
      }
    } catch (error) {
      await disconnectAsync()
    }
  }
}
