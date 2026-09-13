/**
 * 价格格式化（分 -> "¥12.90"）
 */
export function formatPrice(fen = 0) {
  const yuan = Math.floor(fen / 100)
  const dec = String(fen % 100).padStart(2, '0')
  return `\u00A5${yuan}.${dec}`
}