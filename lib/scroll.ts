/** 原生平滑滚回页面顶部（替代 Lenis） */
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" })
}
