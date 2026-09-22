<script setup>
import { computed, ref } from 'vue'
import BoardColumn from './components/BoardColumn.vue'
import TaskModal from './components/TaskModal.vue'
import { STATUSES, useTasks } from './composables/useTasks'
import { useTheme } from './composables/useTheme'

const { tasks, addTask, updateTask, removeTask, moveTask } = useTasks()
const { isDark, toggleTheme } = useTheme()

// null | 'create' | 'edit'
const modalMode = ref(null)
const editingTask = ref(null)

function openCreate() {
  editingTask.value = null
  modalMode.value = 'create'
}

function openEdit(task) {
  editingTask.value = task
  modalMode.value = 'edit'
}

function closeModal() {
  modalMode.value = null
  editingTask.value = null
}

function handleSave(payload) {
  if (modalMode.value === 'edit' && editingTask.value) {
    updateTask(editingTask.value.id, payload)
  } else {
    addTask(payload)
  }
  closeModal()
}

const byStatus = computed(() => {
  const map = Object.fromEntries(STATUSES.map((s) => [s.id, []]))
  for (const task of tasks.value) {
    if (map[task.status]) map[task.status].push(task)
  }
  return map
})
</script>

<template>
  <div
    class="min-h-screen bg-slate-100 font-sans text-slate-900 antialiased transition-colors dark:bg-[#0f1115] dark:text-slate-100"
  >
    <header
      class="sticky top-0 z-10 border-b border-slate-200 bg-slate-100/80 backdrop-blur dark:border-slate-800 dark:bg-[#0f1115]/80"
    >
      <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <div class="flex items-center gap-3">
          <span
            class="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900"
          >
            <svg
              class="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </span>
          <div>
            <h1 class="text-base font-bold tracking-tight sm:text-lg">任务看板</h1>
            <p class="text-xs text-slate-500 dark:text-slate-400">
              共 {{ tasks.length }} 个任务 · 数据仅保存在本机浏览器
            </p>
          </div>
        </div>
        <div class="flex shrink-0 items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white transition hover:bg-slate-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            @click="openCreate"
          >
            <svg
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            新建任务
          </button>
          <button
            type="button"
            class="grid size-9 place-items-center rounded-lg border border-slate-200 text-slate-600 transition hover:bg-white hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            :aria-label="isDark ? '切换到浅色模式' : '切换到深色模式'"
            @click="toggleTheme"
          >
            <svg
              v-if="isDark"
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
            <svg
              v-else
              class="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              aria-hidden="true"
            >
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
            </svg>
          </button>
        </div>
      </div>
    </header>

    <main class="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <div class="grid items-start gap-4 md:grid-cols-3">
        <BoardColumn
          v-for="status in STATUSES"
          :key="status.id"
          :status="status"
          :tasks="byStatus[status.id]"
          @drop-task="(taskId) => moveTask(taskId, status.id)"
          @edit="openEdit"
          @delete="removeTask"
        />
      </div>
    </main>

    <TaskModal
      v-if="modalMode"
      :mode="modalMode"
      :task="editingTask"
      @save="handleSave"
      @close="closeModal"
    />
  </div>
</template>
