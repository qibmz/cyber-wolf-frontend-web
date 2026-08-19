"use client"

import { useCallback, useLayoutEffect, useRef } from "react"

export function ScrollStackItem({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`scroll-stack-card ${className}`.trim()}>{children}</div>
  )
}

interface ScrollStackProps {
  children: React.ReactNode
  className?: string
  /** 卡片之间的垂直间距 */
  itemDistance?: number
  /** 每张卡片的基础缩放递增量 */
  itemScale?: number
  /** 堆叠时卡片错开的距离 */
  itemStackDistance?: number
  /** 触发位置（百分比或 px） */
  stackPosition?: string | number
  scaleEndPosition?: string | number
  /** 卡片最终缩放 */
  baseScale?: number
  /** 每张卡片的旋转角度递增量 */
  rotationAmount?: number
  /** 堆叠后方卡片的模糊量 */
  blurAmount?: number
  onStackComplete?: () => void
}

/**
 * ScrollStack 层叠卡片（reactbits 移植版）。
 * 适配：移除内置 Lenis，改用 rAF 读取 window 滚动（配合全局 LenisProvider）。
 */
export function ScrollStack({
  children,
  className = "",
  itemDistance = 100,
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = "20%",
  scaleEndPosition = "10%",
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  onStackComplete,
}: ScrollStackProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rafRef = useRef<number | null>(null)
  const cardsRef = useRef<HTMLElement[]>([])
  const stackCompletedRef = useRef(false)
  const lastTransformsRef = useRef(
    new Map<
      number,
      { translateY: number; scale: number; rotation: number; blur: number }
    >()
  )
  const isUpdatingRef = useRef(false)
  // 缓存卡片/锚点的文档布局坐标（transform 不影响布局位置，
  // 避免 getBoundingClientRect 读到被 transform 位移后的值导致抖动）
  const offsetsRef = useRef<number[]>([])
  const endOffsetRef = useRef(0)

  const calculateProgress = (scrollTop: number, start: number, end: number) => {
    if (scrollTop < start) return 0
    if (scrollTop > end) return 1
    return (scrollTop - start) / (end - start)
  }

  const parsePercentage = (value: string | number, containerHeight: number) => {
    if (typeof value === "string" && value.includes("%")) {
      return (parseFloat(value) / 100) * containerHeight
    }
    return typeof value === "number" ? value : parseFloat(value)
  }

  const getDocumentOffset = (element: Element) => {
    const rect = element.getBoundingClientRect()
    return rect.top + window.scrollY
  }

  const updateCardTransforms = useCallback(() => {
    if (!cardsRef.current.length || isUpdatingRef.current) return
    isUpdatingRef.current = true

    const scrollTop = window.scrollY
    const containerHeight = window.innerHeight
    const stackPositionPx = parsePercentage(stackPosition, containerHeight)
    const scaleEndPositionPx = parsePercentage(
      scaleEndPosition,
      containerHeight
    )
    const endElementTop = endOffsetRef.current

    cardsRef.current.forEach((card, i) => {
      if (!card) return

      const cardTop = offsetsRef.current[i] ?? getDocumentOffset(card)
      const triggerStart = cardTop - stackPositionPx - itemStackDistance * i
      const triggerEnd = cardTop - scaleEndPositionPx
      const pinStart = cardTop - stackPositionPx - itemStackDistance * i
      const pinEnd = endElementTop - containerHeight / 2

      const scaleProgress = calculateProgress(
        scrollTop,
        triggerStart,
        triggerEnd
      )
      const targetScale = baseScale + i * itemScale
      const scale = 1 - scaleProgress * (1 - targetScale)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0

      let blur = 0
      if (blurAmount) {
        let topCardIndex = 0
        for (let j = 0; j < cardsRef.current.length; j++) {
          const jTriggerStart =
            (offsetsRef.current[j] ?? getDocumentOffset(cardsRef.current[j])) -
            stackPositionPx -
            itemStackDistance * j
          if (scrollTop >= jTriggerStart) topCardIndex = j
        }
        if (i < topCardIndex)
          blur = Math.max(0, (topCardIndex - i) * blurAmount)
      }

      let translateY = 0
      const isPinned = scrollTop >= pinStart && scrollTop <= pinEnd
      if (isPinned) {
        translateY =
          scrollTop - cardTop + stackPositionPx + itemStackDistance * i
      } else if (scrollTop > pinEnd) {
        translateY = pinEnd - cardTop + stackPositionPx + itemStackDistance * i
      }

      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100,
      }
      const last = lastTransformsRef.current.get(i)
      const hasChanged =
        !last ||
        Math.abs(last.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(last.scale - newTransform.scale) > 0.001 ||
        Math.abs(last.rotation - newTransform.rotation) > 0.1 ||
        Math.abs(last.blur - newTransform.blur) > 0.1

      if (hasChanged) {
        card.style.transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`
        card.style.filter =
          newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : ""
        lastTransformsRef.current.set(i, newTransform)
      }

      if (i === cardsRef.current.length - 1) {
        const isInView = scrollTop >= pinStart && scrollTop <= pinEnd
        if (isInView && !stackCompletedRef.current) {
          stackCompletedRef.current = true
          onStackComplete?.()
        } else if (!isInView && stackCompletedRef.current) {
          stackCompletedRef.current = false
        }
      }
    })

    isUpdatingRef.current = false
  }, [
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    onStackComplete,
  ])

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const cards = Array.from(
      container.querySelectorAll<HTMLElement>(".scroll-stack-card")
    )
    cardsRef.current = cards
    const transformsCache = lastTransformsRef.current

    // 缓存初始文档布局坐标（卡片初始 transform 为 translateZ(0)，rect 即布局位置）
    const calcOffsets = () => {
      offsetsRef.current = cards.map((card) => getDocumentOffset(card))
      const endElement =
        container.querySelector<HTMLElement>(".scroll-stack-end")
      endOffsetRef.current = endElement ? getDocumentOffset(endElement) : 0
    }
    calcOffsets()
    window.addEventListener("resize", calcOffsets)

    cards.forEach((card, i) => {
      if (i < cards.length - 1) {
        card.style.marginBottom = `${itemDistance}px`
      }
      card.style.willChange = "transform, filter"
      card.style.transformOrigin = "top center"
      card.style.backfaceVisibility = "hidden"
      card.style.transform = "translateZ(0)"
    })

    // rAF 驱动（全局 Lenis 改变 window.scrollY 后自动生效）
    const loop = () => {
      updateCardTransforms()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", calcOffsets)
      cardsRef.current = []
      transformsCache.clear()
      offsetsRef.current = []
      endOffsetRef.current = 0
      stackCompletedRef.current = false
      isUpdatingRef.current = false
    }
  }, [
    itemDistance,
    itemScale,
    itemStackDistance,
    stackPosition,
    scaleEndPosition,
    baseScale,
    rotationAmount,
    blurAmount,
    updateCardTransforms,
  ])

  return (
    <div ref={containerRef} className={`relative w-full ${className}`.trim()}>
      <div className="scroll-stack-inner">
        {children}
        {/* 滚动释放锚点 */}
        <div className="scroll-stack-end" />
      </div>
    </div>
  )
}
