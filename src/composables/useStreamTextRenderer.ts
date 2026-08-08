import { onUnmounted } from 'vue'

const CHARACTER_INTERVAL_MS = 18

export function useStreamTextRenderer() {
  let buffer = ''
  let render: ((content: string) => void) | null = null
  let timer: ReturnType<typeof setTimeout> | undefined
  let idleResolvers: Array<() => void> = []

  function enqueue(content: string, onRender: (content: string) => void) {
    if (!content) return
    buffer += content
    render = onRender
    if (!timer) flushNext()
  }

  function waitForIdle(): Promise<void> {
    if (!buffer && !timer) return Promise.resolve()
    return new Promise((resolve) => idleResolvers.push(resolve))
  }

  function flushNext() {
    if (!buffer || !render) {
      timer = undefined
      idleResolvers.splice(0).forEach((resolve) => resolve())
      return
    }

    const size = buffer.length > 48 ? 3 : buffer.length > 16 ? 2 : 1
    render(buffer.slice(0, size))
    buffer = buffer.slice(size)
    timer = setTimeout(flushNext, CHARACTER_INTERVAL_MS)
  }

  function clear() {
    if (timer) clearTimeout(timer)
    timer = undefined
    buffer = ''
    render = null
    idleResolvers.splice(0).forEach((resolve) => resolve())
  }

  onUnmounted(clear)

  return { enqueue, waitForIdle, clear }
}
