<script setup>
import { ref } from 'vue'
import InspirationCard from './components/InspirationCard.vue'

const inspirations = ref([
  {
    id: 1,
    title: '晨间冥想',
    content: '每天花10分钟静坐冥想，让心灵回归平静，倾听内心最真实的声音。',
    tag: '生活',
    color: 'from-violet-500 to-purple-600',
  },
  {
    id: 2,
    title: '代码与诗意',
    content: '编程不仅是逻辑的堆叠，更是一种创造性的表达。每一行代码都是写给未来的诗。',
    tag: '技术',
    color: 'from-cyan-500 to-blue-600',
  },
  {
    id: 3,
    title: '行走的力量',
    content: '走出去，看看外面的世界。每一段旅途都是对自我的重新发现。',
    tag: '旅行',
    color: 'from-amber-500 to-orange-600',
  },
])

const newInspiration = ref('')
const newTitle = ref('')
const newTag = ref('')

function addInspiration() {
  if (!newInspiration.value.trim()) return
  inspirations.value.push({
    id: Date.now(),
    title: newTitle.value.trim() || '无题灵感',
    content: newInspiration.value.trim(),
    tag: newTag.value.trim() || '随笔',
    color: 'from-emerald-500 to-teal-600',
  })
  newInspiration.value = ''
  newTitle.value = ''
  newTag.value = ''
}
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
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
        <p class="text-slate-400 text-sm hidden sm:block">捕捉每一刻灵感 ✨</p>
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
            />
          </div>
          <textarea
            v-model="newInspiration"
            rows="3"
            placeholder="写下你的灵感..."
            class="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all resize-none mb-4"
          ></textarea>
          <button
            @click="addInspiration"
            class="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-semibold px-6 py-2.5 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all active:scale-95"
          >
            ✦ 捕捉灵感
          </button>
        </div>
      </section>

      <!-- Inspiration Cards -->
      <section>
        <h2 class="text-lg font-semibold text-slate-300 mb-6">我的灵感集</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <InspirationCard
            v-for="inspiration in inspirations"
            :key="inspiration.id"
            :title="inspiration.title"
            :content="inspiration.content"
            :tag="inspiration.tag"
            :color="inspiration.color"
          />
        </div>
        <div v-if="inspirations.length === 0" class="text-center py-20">
          <p class="text-slate-500 text-lg">还没有灵感，快来捕捉第一个吧 ✦</p>
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
