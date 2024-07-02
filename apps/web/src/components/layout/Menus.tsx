import { MenuItem } from '@/utils/type'
import Link from 'next/link'

export const Menus = ({ menuItems }: { menuItems: MenuItem[] }) => {
  return (
    <>
      {menuItems.map(({ label, href }) => (
        <Link
          className="hover:underline underline-offset-8"
          key={label}
          href={href}
        >
          {label}
        </Link>
      ))}
    </>
  )
}
