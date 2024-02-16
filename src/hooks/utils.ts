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

export function rafThrottle(fn: (...args: unknown[]) => unknown) {
  let lock = false
  return function (this: unknown, ...args: unknown[]) {
    if (lock) return
    lock = true
    window.requestAnimationFrame(() => {
      fn.apply(this, args)
      lock = false
    })
  }
}
