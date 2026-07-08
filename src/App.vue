<script setup>
import { ref, watch } from 'vue'
import { useInspiration } from './composables/useInspiration.js'
import InspirationCard from './components/InspirationCard.vue'

// ==================== 灵感数据管理 ====================
const {
  inspirations,
  newInspiration,
  newTitle,
  newTag,
  selectedTag,
  tagOptions,
  filteredInspirations,
  addInspiration,
  deleteInspiration,
  exportData,
  importData,
  onInspirationInput,
} = useInspiration()

// ==================== 监听输入自动分类标签 ====================
watch(newInspiration, (val) => {
  onInspirationInput(val)
})

// ==================== Toast 提示系统 ====================
const toastMessage = ref('')
const toastType = ref('success')
const toastVisible = ref(false)
let toastTimer = null

/**
 * 显示 Toast 提示消息
 * @param {string} message - 提示内容
 * @param {string} type - 类型：success | warning | error
 */
function showToast(message, type = 'success') {
  toastMessage.value = message
  toastType.value = type
  toastVisible.value = true
  if (toastTimer) clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    toastVisible.value = false
  }, 2500)
}

// ==================== 事件处理 ====================

/**
 * 处理添加灵感按钮点击
 */
function handleAddInspiration() {
  const result = addInspiration()
  showToast(result.message, result.type)
}

/**
 * 处理删除灵感事件
 * @param {Object} payload - 包含 createTime 和 title
 */
function handleDeleteInspiration(payload) {
  const result = deleteInspiration(payload)
  showToast(result.message, result.type)
}

/**
 * 处理导出数据
 */
function handleExportData() {
  const result = exportData()
  showToast(result.message, result.type)
}

/**
 * 处理导入数据 - 合并现有灵感并去重
 */
function handleImportData() {
  importData((result) => {
    showToast(result.message, result.type)
    if (result.success) {
      setTimeout(() => {
        window.location.reload()
      }, 800)
    }
  })
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
    <!-- Toast 提示 -->
    <transition name="toast">
      <div
        v-if="toastVisible"
        :class="[
          'fixed top-5 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white font-medium text-sm flex items-center gap-2',
          toastType === 'success' ? 'bg-emerald-600' : toastType === 'warning' ? 'bg-amber-600' : 'bg-red-600'
        ]"
      >
        <span v-if="toastType === 'success'">✓</span>
        <span v-else-if="toastType === 'warning'">⚠</span>
        <span v-else>✕</span>
        {{ toastMessage }}
      </div>
    </transition>

    <!-- Header -->
    <header class="border-b border-slate-700/50 backdrop-blur-sm bg-slate-900/60 sticky top-0 z-10">
      <div class="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl shadow-lg shadow-orange-500/20">
            ✦
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">
            Inspiration<span class="text-amber-400">Catcher</span>
          </h1>
        </div>
        <div class="flex items-center gap-3">
          <!-- 标签筛选 -->
          <div class="relative">
            <select
              v-model="selectedTag"
              class="appearance-none bg-slate-800 border border-slate-600 rounded-xl px-4 py-2 pr-8 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all cursor-pointer"
            >
              <option v-for="tag in tagOptions" :key="tag" :value="tag">
                {{ tag === '全部' ? '全部' : tag }}
              </option>
            </select>
            <div class="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
              ▼
            </div>
          </div>

          <!-- 导入按钮 -->
          <button
            @click="handleImportData"
            class="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-medium px-4 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            导入
          </button>

          <!-- 导出按钮 -->
          <button
            @click="handleExportData"
            class="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 text-sm font-medium px-4 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            导出
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-5xl mx-auto px-6 py-10">
      <!-- Add Inspiration Section -->
      <section class="mb-12">
        <h2 class="text-lg font-semibold text-slate-300 mb-4">记录新灵感</h2>
        <div class="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 backdrop-blur-sm">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              v-model="newTitle"
              type="text"
              placeholder="灵感标题..."
              class="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
            />
            <input
              v-model="newTag"
              type="text"
              placeholder="标签 (如：生活、技术、旅行)"
              class="bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              readonly
            />
          </div>
          <textarea
            v-model="newInspiration"
            rows="3"
            placeholder="写下你的灵感..."
            class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none mb-4"
          ></textarea>
          <button
            @click="handleAddInspiration"
            class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-95"
          >
            ✦ 捕捉灵感
          </button>
        </div>
      </section>

      <!-- Inspiration Cards -->
      <section>
        <h2 class="text-lg font-semibold text-slate-300 mb-6">
          我的灵感集
          <span v-if="selectedTag !== '全部'" class="text-sm text-amber-400 ml-2">
            ({{ selectedTag }})
          </span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InspirationCard
            v-for="inspiration in filteredInspirations"
            :key="inspiration.create_time"
            :title="inspiration.title"
            :content="inspiration.content"
            :tag="inspiration.tag"
            :create-time="inspiration.create_time"
            @delete="handleDeleteInspiration"
          />
        </div>
        <!-- 空状态 -->
        <div v-if="filteredInspirations.length === 0" class="text-center py-20">
          <div class="inline-flex flex-col items-center">
            <div class="w-20 h-20 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex items-center justify-center mb-5">
              <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-slate-500">
                <path d="M12 3v18"/>
                <path d="M3 12h18"/>
                <circle cx="12" cy="12" r="9"/>
              </svg>
            </div>
            <p class="text-slate-400 text-lg font-medium mb-2">
              {{ selectedTag !== '全部' ? '该标签下暂无灵感' : '还没有灵感' }}
            </p>
            <p class="text-slate-600 text-sm">
              {{ selectedTag !== '全部' ? '试试切换其他标签看看吧 ✦' : '快来捕捉你的第一个灵感吧 ✦' }}
            </p>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-700/50 mt-12">
      <div class="max-w-5xl mx-auto px-6 py-6 text-center text-slate-500 text-sm">
        <p>InspirationCatcher — 用心捕捉每一刻灵感</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
