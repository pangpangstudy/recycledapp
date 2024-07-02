import { ReactNode } from 'react'
import { RecycleChain } from './typechain-types'

export type MenuItem = {
  label: string
  href: string
}

export type BaseComponent = {
  children?: ReactNode
  className?: string
}

export type ActionType<T = string> = {
  contract: RecycleChain
  payload: T
}
