"use client"

import { useState } from "react"
import Lightbox from "yet-another-react-lightbox"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Counter from "yet-another-react-lightbox/plugins/counter"
import Download from "yet-another-react-lightbox/plugins/download"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import "yet-another-react-lightbox/styles.css"

import { NewsImage } from "@/components/news/news-image"

interface ImagePreviewProps {
  src?: string
  alt: string
  className?: string
}

/**
 * 可点击预览的图片（Lightbox 交互组件，供 Server 页面嵌入）。
 * 无封面时仅展示占位，不打开空 lightbox。
 */
export function ImagePreview({ src, alt, className }: ImagePreviewProps) {
  const [index, setIndex] = useState(-1)

  if (!src) {
    return <NewsImage src={src} alt={alt} className={className} />
  }

  const slides = [{ src, alt }]

  return (
    <>
      <button
        type="button"
        aria-label="预览图片"
        onClick={() => setIndex(0)}
        className="cursor-zoom-in text-left"
      >
        <NewsImage src={src} alt={alt} className={className} />
      </button>

      <Lightbox
        index={index}
        open={index >= 0}
        close={() => setIndex(-1)}
        slides={slides}
        plugins={[Zoom, Counter, Download, Fullscreen]}
        zoom={{ maxZoomPixelRatio: 5 }}
        carousel={{ finite: true }}
      />
    </>
  )
}
