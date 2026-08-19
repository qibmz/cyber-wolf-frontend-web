"use client"

import { useEffect, useRef, useState } from "react"

const SCRAMBLE_CHARS = "!<>-_\\/[]{}—=+*^?#01"

interface TextScrambleProps {
  /** 最终显示的文本 */
  value: string
  /** 乱码总时长（毫秒） */
  duration?: number
  className?: string
  onComplete?: () => void
}

function randomChar() {
  return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
}

function scrambleText(text: string) {
  return text
    .split("")
    .map((ch) => (ch === " " ? " " : randomChar()))
    .join("")
}

/**
 * ScrambleText 黑客乱码解密：
 * 初始显示随机乱码，逐字符从左到右解密为最终文本。
 */
export function TextScramble({
  value,
  duration = 900,
  className,
  onComplete,
}: TextScrambleProps) {
  const [output, setOutput] = useState(() => scrambleText(value))
  const completedRef = useRef(false)

  useEffect(() => {
    completedRef.current = false
    // 初始乱码由 useState 惰性初始化提供，此处不再同步 setState

    const chars = value.split("")
    const frameMs = 45
    const totalFrames = Math.max(8, Math.round(duration / frameMs))
    let frame = 0

    const interval = setInterval(() => {
      frame++
      const revealCount = Math.floor((frame / totalFrames) * chars.length)
      const next = chars
        .map((ch, i) => {
          if (ch === " ") return " "
          if (i < revealCount) return ch
          return randomChar()
        })
        .join("")
      setOutput(next)

      if (frame >= totalFrames) {
        clearInterval(interval)
        setOutput(value)
        if (!completedRef.current) {
          completedRef.current = true
          onComplete?.()
        }
      }
    }, frameMs)

    return () => clearInterval(interval)
  }, [value, duration, onComplete])

  return <span className={className}>{output}</span>
}
