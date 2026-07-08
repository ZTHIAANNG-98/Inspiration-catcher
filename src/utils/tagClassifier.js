/**
 * 标签自动分类器 - 纯前端关键词匹配
 */

import { TAG_KEYWORDS } from './constants.js'

/**
 * 根据文本内容自动分类标签
 * @param {string} text - 待分类的文本内容
 * @returns {string} 匹配到的标签，未匹配则返回 '随笔'
 */
export function autoClassifyTag(text) {
  if (!text || typeof text !== 'string') return '随笔'
  const lowerText = text.toLowerCase()
  for (const [tag, keywords] of Object.entries(TAG_KEYWORDS)) {
    if (keywords.some(kw => lowerText.includes(kw.toLowerCase()))) {
      return tag
    }
  }
  return '随笔'
}
