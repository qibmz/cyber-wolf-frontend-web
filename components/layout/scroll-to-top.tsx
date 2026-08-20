"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { ArrowUp } from "lucide-react"

import { scrollToTop } from "@/components/lenis-provider"

/**
 * 回到顶部按钮（framer-motion 现成动画）：
 * 滚动超过阈值后滑入，hover 填充主题色，点击平滑回顶。
 */
export function ScrollToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 300)
    window.addEventListener("scroll", onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleClick() {
    scrollToTop()
  }

  return (
    <motion.button
      type="button"
      aria-label="回到顶部"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
      onClick={handleClick}
      initial={{ y: 40, opacity: 0 }}
      animate={{ y: visible ? 0 : 40, opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{
        backgroundColor: "var(--primary)",
        borderColor: "var(--primary)",
        color: "#ffffff",
      }}
      whileTap={{ scale: 0.9 }}
      style={{ pointerEvents: visible ? "auto" : "none" }}
      className="fixed right-6 bottom-6 z-40 flex size-10 cursor-pointer items-center justify-center rounded-full border border-muted-foreground bg-transparent text-muted-foreground"
    >
      <ArrowUp className="size-5" />
    </motion.button>
  )
}
