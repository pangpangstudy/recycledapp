'use client'
import { MenuItem } from '@/utils/type'
import LoginButton from '../LoginButton'

export interface INavSidebarProps {
  menuItems: MenuItem[]
}

export const NavSidebar = ({ menuItems }: INavSidebarProps) => {
  return (
    <>
      <LoginButton />
    </>
  )
}
