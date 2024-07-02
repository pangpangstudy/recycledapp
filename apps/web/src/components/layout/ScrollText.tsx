'use client'
import { motion } from 'framer-motion'
import React, { useEffect, useState } from 'react'

type Props = {
  items: string[]
  className?: string
}
// 动画思路：计时器 挂载新元素
const ScrollText = ({ items, className }: Props) => {
  const [selected, setSelected] = useState(0)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setSelected((pre) => {
        return (pre + 1) % items.length
      })
    }, 2000)
    return () => clearInterval(intervalId)
  }, [items.length])

  return (
    <div className="inline-block">
      <motion.div
        key={items[selected]}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className={className}>{items[selected]}</div>
      </motion.div>
    </div>
  )
}

export default ScrollText
