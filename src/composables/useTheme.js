import { ref } from 'vue'

const THEME_KEY = 'kanban.theme'

// 初始值来自 index.html 中的内联脚本（已把 dark class 挂到 <html> 上）
const isDark = ref(
  typeof document !== 'undefined' && document.documentElement.classList.contains('dark'),
)

function toggleTheme() {
  isDark.value = !isDark.value
  document.documentElement.classList.toggle('dark', isDark.value)
  try {
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  } catch {
    /* 隐私模式下可能写入失败，忽略 */
  }
}

export function useTheme() {
  return { isDark, toggleTheme }
}
