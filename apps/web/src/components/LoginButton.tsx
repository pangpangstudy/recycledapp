'use client'
import { useAuth } from '@/hooks/useAuth'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import React from 'react'

const LoginButton = () => {
  useAuth()
  return <ConnectButton />
}

export default LoginButton
