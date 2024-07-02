import { MenuItem } from '@/utils/type'
import { IconBox, IconBuildingFactory2, IconHome } from '@tabler/icons-react'
import Link from 'next/link'
import React from 'react'
import { Logo } from './Logo'
import { Menus } from './Menus'
import { NavSidebar } from './NavSidebar'
const MENUITEMS: MenuItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Manufacturers',
    href: '/manufacturers',
  },
  { label: 'Products', href: '/products' },
]

const Header = () => {
  return (
    <header>
      <nav className="fixed z-50 top-0 w-full  bg-white">
        <div className="container sm:px-2 mx-auto relative   flex items-center justify-between h-16 py-2">
          <div className="relative flex items-center justify-between w-full gap-16">
            <Link href="/" aria-label="Home" className="w-auto z-50">
              <Logo />
            </Link>
            <div className="flex items-center gap-2">
              <div className="text-sm mr-6  gap-5 hidden md:flex">
                <Menus menuItems={MENUITEMS} />
              </div>
              <NavSidebar menuItems={MENUITEMS} />
            </div>
          </div>
        </div>
      </nav>
      <div className="h-16" />
    </header>
  )
}

export default Header
