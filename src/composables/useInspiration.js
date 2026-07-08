/**
 * 灵感数据管理组合式函数
 * 封装灵感的增删改查、导入导出、筛选等业务逻辑
 */

import { ref, computed } from 'vue'
import { loadFromStorage, saveToStorage } from './useStorage.js'
import { autoClassifyTag } from '../utils/tagClassifier.js'
import { TAG_OPTIONS } from '../utils/constants.js'

/**
 * 创建灵感数据管理实例
 * @returns {Object} 灵感相关的响应式数据和方法
 */
export function useInspiration() {
  // ==================== 响应式数据 ====================
  /** 灵感列表 */
  const inspirations = ref(loadFromStorage())
  /** 新灵感内容输入 */
  const newInspiration = ref('')
  /** 新灵感标题输入 */
  const newTitle = ref('')
  /** 新灵感标签（自动填充） */
  const newTag = ref('')
  /** 当前选中的筛选标签 */
  const selectedTag = ref('全部')

  // ==================== 计算属性 ====================
  /**
   * 根据选中标签过滤后的灵感列表，按 create_time 倒序排列
   * 最新的灵感排在最前面
   */
  const filteredInspirations = computed(() => {
    let list = inspirations.value
    if (selectedTag.value !== '全部' && selectedTag.value) {
      list = list.filter(item => item.tag === selectedTag.value)
    }
    // 按 create_time 降序排列（最新的在前）
    return [...list].sort((a, b) => b.create_time - a.create_time)
  })

  /** 检查标题是否已存在 */
  function isTitleDuplicate(title) {
    const normalized = title.trim()
    return inspirations.value.some(item => item.title === normalized)
  }

  // ==================== 核心方法 ====================

  /**
   * 添加新灵感
   * 数据格式仅保留：create_time, title, content, tag
   * 流程：校验 → 查重 → 构建数据 → 推入列表 → 持久化 → 重新加载
   */
  function addInspiration() {
    if (!newInspiration.value.trim()) {
      return { success: false, message: '请先写下你的灵感内容', type: 'warning' }
    }

    const titleVal = newTitle.value.trim() || '无题灵感'

    // 检查标题是否重复
    if (isTitleDuplicate(titleVal)) {
      return { success: false, message: '该标题已存在，请更换一个标题', type: 'warning' }
    }

    const obj = {
      create_time: Date.now(),
      title: titleVal,
      content: newInspiration.value.trim(),
      tag: newTag.value.trim() || '随笔',
    }

    inspirations.value.push(obj)

    if (saveToStorage(inspirations.value)) {
      // 重新从 localStorage 读取，确保数据一致性
      inspirations.value = loadFromStorage()
      // 清空输入
      newInspiration.value = ''
      newTitle.value = ''
      newTag.value = ''
      return { success: true, message: '恭喜你，这是一条成功消息', type: 'success' }
    } else {
      // 保存失败时回滚内存数据
      inspirations.value.pop()
      return { success: false, message: '保存失败，请检查浏览器存储权限', type: 'error' }
    }
  }

  /**
   * 删除灵感（根据 create_time + title 确保唯一性）
   * @param {Object} payload - 包含 createTime 和 title 的对象
   */
  function deleteInspiration({ createTime, title }) {
    const beforeLen = inspirations.value.length
    inspirations.value = inspirations.value.filter(item => {
      // 必须同时匹配 create_time 和 title
      return !(item.create_time === createTime && item.title === title)
    })
    const afterLen = inspirations.value.length
    if (afterLen < beforeLen) {
      saveToStorage(inspirations.value)
      inspirations.value = loadFromStorage()
      return { success: true, message: '删除成功', type: 'success' }
    }
    return { success: false, message: '删除失败，未找到对应灵感', type: 'error' }
  }

  /**
   * 导出灵感数据为 JSON 文件
   */
  function exportData() {
    try {
      const dataStr = JSON.stringify(inspirations.value, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inspirations_${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      return { success: true, message: '导出成功', type: 'success' }
    } catch (e) {
      console.error('[useInspiration] 导出失败', e)
      return { success: false, message: '导出失败，请重试', type: 'error' }
    }
  }

  /**
   * 导入灵感数据并与现有数据合并去重
   * 去重策略：以 create_time + title 为唯一键
   * @param {Array} importedList - 从文件解析出的灵感数组
   * @returns {Object} 导入结果 { success, message, type, mergedCount }
   */
  function mergeImportedData(importedList) {
    if (!Array.isArray(importedList)) {
      return { success: false, message: '文件格式不正确，应为 JSON 数组', type: 'error' }
    }

    // 构建现有数据的唯一键集合（create_time + title）
    const existingKeys = new Set(
      inspirations.value.map(item => `${item.create_time}_${item.title}`)
    )

    let mergedCount = 0
    for (const item of importedList) {
      if (!item || typeof item !== 'object') continue
      const key = `${item.create_time}_${item.title}`
      if (!existingKeys.has(key)) {
        // 标准化数据格式，仅保留核心字段
        const normalized = {
          create_time: item.create_time || Date.now(),
          title: item.title || '无题灵感',
          content: item.content || '',
          tag: item.tag || '随笔',
        }
        inspirations.value.push(normalized)
        existingKeys.add(key)
        mergedCount++
      }
    }

    if (saveToStorage(inspirations.value)) {
      inspirations.value = loadFromStorage()
      return {
        success: true,
        message: `导入成功，合并了 ${mergedCount} 条新灵感`,
        type: 'success',
        mergedCount
      }
    }
    return { success: false, message: '保存失败，请检查浏览器存储权限', type: 'error' }
  }

  /**
   * 处理文件导入（触发文件选择并解析）
   * @param {Function} onResult - 导入结果回调 (result) => void
   */
  function importData(onResult) {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json,application/json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      if (!file) return
      const reader = new FileReader()
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result)
          const result = mergeImportedData(imported)
          onResult(result)
        } catch (err) {
          console.error('[useInspiration] 解析导入文件失败', err)
          onResult({ success: false, message: '解析文件失败，请检查 JSON 格式', type: 'error' })
        }
      }
      reader.onerror = () => {
        onResult({ success: false, message: '读取文件失败', type: 'error' })
      }
      reader.readAsText(file)
    }
    input.click()
  }

  /**
   * 监听灵感内容输入，自动分类标签
   */
  function onInspirationInput(val) {
    if (val && val.trim()) {
      newTag.value = autoClassifyTag(val)
    } else {
      newTag.value = ''
    }
  }

  return {
    // 数据
    inspirations,
    newInspiration,
    newTitle,
    newTag,
    selectedTag,
    tagOptions: TAG_OPTIONS,
    filteredInspirations,
    // 方法
    addInspiration,
    deleteInspiration,
    exportData,
    importData,
    onInspirationInput,
    isTitleDuplicate,
  }
}
