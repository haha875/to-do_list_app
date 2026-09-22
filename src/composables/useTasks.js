import { ref, watch } from 'vue'

const STORAGE_KEY = 'kanban.tasks.v1'

export const STATUSES = [
  { id: 'todo', label: '待办', dot: 'bg-slate-400' },
  { id: 'doing', label: '进行中', dot: 'bg-blue-500' },
  { id: 'done', label: '完成', dot: 'bg-emerald-500' },
]

export const PRIORITIES = [
  {
    id: 'high',
    label: '高',
    dot: 'bg-red-500',
    chip: 'bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400',
    active:
      'border-red-400 bg-red-50 text-red-700 dark:border-red-500/60 dark:bg-red-500/10 dark:text-red-400',
  },
  {
    id: 'medium',
    label: '中',
    dot: 'bg-yellow-400',
    chip: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-500/15 dark:text-yellow-400',
    active:
      'border-yellow-400 bg-yellow-50 text-yellow-700 dark:border-yellow-500/60 dark:bg-yellow-500/10 dark:text-yellow-400',
  },
  {
    id: 'low',
    label: '低',
    dot: 'bg-green-500',
    chip: 'bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400',
    active:
      'border-green-400 bg-green-50 text-green-700 dark:border-green-500/60 dark:bg-green-500/10 dark:text-green-400',
  },
]

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
}

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const data = JSON.parse(raw)
    if (!Array.isArray(data)) return []
    return data.filter(
      (t) =>
        t &&
        typeof t.id === 'string' &&
        typeof t.title === 'string' &&
        STATUSES.some((s) => s.id === t.status) &&
        PRIORITIES.some((p) => p.id === t.priority),
    )
  } catch {
    return []
  }
}

// 模块级单例：所有组件共享同一份数据
const tasks = ref(loadTasks())

watch(
  tasks,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
    } catch {
      /* 隐私模式下可能写入失败，忽略 */
    }
  },
  { deep: true },
)

export function useTasks() {
  function addTask({ title, description = '', priority = 'medium' }) {
    const now = Date.now()
    tasks.value.unshift({
      id: uid(),
      title,
      description,
      priority,
      status: 'todo',
      createdAt: now,
      updatedAt: now,
    })
  }

  function updateTask(id, patch) {
    const task = tasks.value.find((t) => t.id === id)
    if (!task) return
    Object.assign(task, patch, { updatedAt: Date.now() })
  }

  function removeTask(id) {
    tasks.value = tasks.value.filter((t) => t.id !== id)
  }

  // 拖拽换列：将卡片移动到目标状态列的末尾
  function moveTask(id, status) {
    const index = tasks.value.findIndex((t) => t.id === id)
    if (index === -1 || !STATUSES.some((s) => s.id === status)) return
    const [task] = tasks.value.splice(index, 1)
    task.status = status
    task.updatedAt = Date.now()
    let last = -1
    tasks.value.forEach((t, i) => {
      if (t.status === status) last = i
    })
    tasks.value.splice(last + 1, 0, task)
  }

  return { tasks, addTask, updateTask, removeTask, moveTask }
}
