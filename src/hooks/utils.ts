export function debounce(fn: () => void, delay: number) {
  let timer: number
  return function () {
    clearTimeout(timer)
    timer = window.setTimeout(() => {
      fn()
    }, delay)
  }
}

export function throttle(fn: () => void, delay: number) {
  let last = 0
  return function () {
    const now = Date.now()
    if (now - last > delay) {
      last = now
      fn()
    }
  }
}
