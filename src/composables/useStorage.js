/**
 * localStorage 存储组合式函数
 * 提供安全的读写能力，数据损坏时有降级方案
 */

import { STORAGE_KEY } from '../utils/constants.js'

/**
 * 安全地从 localStorage 读取灵感列表
 * 异常处理：解析失败 / 数据损坏 / 非数组格式时返回空数组
 * @returns {Array} 灵感对象数组，异常时返回空数组
 */
export function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      console.warn('[useStorage] 存储数据格式异常，期望数组，实际为:', typeof parsed)
      return []
    }
    // 数据校验：过滤掉无效条目
    return parsed.filter(item => item && typeof item === 'object')
  } catch (e) {
    console.error('[useStorage] 读取本地存储失败，可能数据已损坏', e)
    // 降级方案：尝试清除损坏数据，避免后续持续报错
    try {
      localStorage.removeItem(STORAGE_KEY)
      console.info('[useStorage] 已清除损坏的存储数据')
    } catch (clearErr) {
      console.error('[useStorage] 清除损坏数据失败', clearErr)
    }
    return []
  }
}

/**
 * 安全地将灵感列表保存到 localStorage
 * @param {Array} list - 灵感对象数组
 * @returns {boolean} 保存是否成功
 */
export function saveToStorage(list) {
  try {
    if (!Array.isArray(list)) {
      console.warn('[useStorage] 保存失败，期望数组类型')
      return false
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
    return true
  } catch (e) {
    // 可能的异常：QuotaExceededError（存储空间已满）、SecurityError（隐私模式）
    console.error('[useStorage] 保存到本地存储失败', e)
    return false
  }
}

/**
 * 清空 localStorage 中的灵感数据
 */
export function clearStorage() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    return true
  } catch (e) {
    console.error('[useStorage] 清除存储失败', e)
    return false
  }
}
