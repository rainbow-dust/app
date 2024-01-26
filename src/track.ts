// https://juejin.cn/post/7163046672874864676
let fufuSDK: EasyAgentSDK | null = null // EasyAgentSDK 实例对象
const QUEUE: (() => void)[] = [] // 任务队列
const NOOP = () => {} // 空函数

interface Options {
  appId: string
  baseUrl: string
  onPageShow: () => void
  onPagesHide: () => void
}

interface Config {
  userId?: string
  userName?: string
  [key: string]: string | number | boolean | object | undefined | null
}

export default class EasyAgentSDK {
  appId = ''
  baseUrl = ''
  timeOnPage = 0
  config = {}
  onPageShow = NOOP
  onPagesHide = NOOP

  constructor(options: Options) {
    this.appId = options.appId
    this.baseUrl = options.baseUrl || window.location.origin
    this.onPageShow = options.onPageShow || NOOP
    this.onPagesHide = options.onPagesHide || NOOP

    // 初始化监听页面变化
    this.listenPage()
  }

  // 设置 config
  setConfig(congfig: Config) {
    this.config = congfig
  }

  // 刷新任务队列
  flushQueue() {
    Promise.resolve().then(() => {
      QUEUE.forEach((fn) => fn())
      QUEUE.length = 0
    })
  }

  // 监听页面变化
  listenPage() {
    let pageShowTime = 0

    window.addEventListener('pageshow', () => {
      console.log('pageshow')
      pageShowTime = performance.now()

      // 执行 onPageShow
      this.onPageShow()
    })

    window.addEventListener('pagehide', () => {
      // 记录用户在页面停留时间
      this.timeOnPage = performance.now() - pageShowTime

      // 刷新队列前执行 onPagesHide
      this.onPagesHide()

      // 刷新任务队列
      this.flushQueue()
    })
  }

  // Json 转 FormData
  json2Blob(data: { [key: string]: unknown }) {
    const blob = new Blob([JSON.stringify(data)], {
      type: 'application/json',
    })
    return blob
  }

  // 自定义上报类型
  report(config: Config) {
    QUEUE.push(() => {
      const blob = this.json2Blob({
        ...this.config,
        ...config,
        time: new Date().toLocaleString(),
        appId: this.appId,
        pageUrl: window.location.href,
      })
      // https://developer.mozilla.org/zh-CN/docs/Web/API/Navigator/sendBeacon
      navigator.sendBeacon(`${this.baseUrl}${config.url || ''}`, blob)
    })
  }

  // 用户行为上报
  actionReport(config: Config) {
    this.report({
      ...config,
      type: 'action',
    })
  }

  // 网络状况上报
  networkReport(config: Config) {
    this.report({
      ...config,
      type: 'network',
    })
  }

  // 页面性能指标上报
  performanceReport(config: Config) {
    this.report({
      ...config,
      type: 'performance',
    })
  }

  // 错误警告上报
  errorReport(config: Config) {
    this.report({
      ...config,
      type: 'error',
    })
  }
}

fufuSDK = new EasyAgentSDK({
  appId: 'application_id',
  baseUrl: 'https://localhost:9527/ping',
  onPageShow() {
    console.log('onPageShow')
    fufuSDK?.actionReport({
      data: {}, // 其他必要传递的信息
    })
  },
  onPagesHide() {
    console.log('onPagesHide')
    fufuSDK?.actionReport({
      data: {}, // 其他必要传递的信息
    })
  },
})

// window.fufuSDK.setConfig({
//   userId: UserInfo.userId, // 当前用户 id
//   userName: UserInfo.userName, // 当前用户 name
// });

const TargetElementFilter = ['export_btn']

const findTarget = (filters: string[]) => {
  return filters.find((filter) => TargetElementFilter.find((v) => filter === v))
}

document.addEventListener('click', (e: MouseEvent) => {
  const { id, className, outerHTML } = e.target as HTMLElement
  const isTarget = findTarget([id, className])

  console.log('click', e.target, isTarget)

  // if (isTarget) {
  fufuSDK?.actionReport({
    data: {
      id,
      className,
      outerHTML,
    }, // 其他必要传递的信息
  })
  fufuSDK?.flushQueue()
  // }
})

// 监听页面滚动
interface ScrollData {
  scrollStartTop: number
  scrollStartLeft: number
  scrollStartTime: number
  scrollEndTop: number
  scrollEndLeft: number
  scrollEndTime: number
}

const lastScrollData: ScrollData = {
  scrollStartTop: 0,
  scrollStartLeft: 0,
  scrollStartTime: 0,
  scrollEndTop: 0,
  scrollEndLeft: 0,
  scrollEndTime: 0,
}

document.addEventListener(
  'scroll',
  debounce(() => {
    const { scrollX, scrollY } = window
    const { scrollStartTop, scrollStartLeft, scrollStartTime } = lastScrollData
    const scrollEndTop = scrollY
    const scrollEndLeft = scrollX
    const scrollEndTime = performance.now()

    // 记录用户滚动数据
    fufuSDK?.actionReport({
      data: {
        scrollStartTop,
        scrollStartLeft,
        scrollStartTime,
        scrollEndTop,
        scrollEndLeft,
        scrollEndTime,
      },
    })

    // 更新滚动数据
    lastScrollData.scrollStartTop = scrollEndTop
    lastScrollData.scrollStartLeft = scrollEndLeft
    lastScrollData.scrollStartTime = scrollEndTime
  }, 200),
)

// 重写 fetch 请求，上报网络状况
const oldFetch = window.fetch
window.fetch = function (...args) {
  const [url, options] = args

  const startTime = performance.now()
  const fetchPromise = oldFetch(...args)

  fetchPromise.then((response) => {
    const endTime = performance.now()
    const duration = endTime - startTime
    fufuSDK?.networkReport({
      data: {
        url,
        options,
        duration,
        status: response.status,
        statusText: response.statusText,
      }, // 其他必要传递的信息
    })
  })

  return fetchPromise
}

// 防抖函数
type DebounceFunction = (...args: unknown[]) => void

function debounce(fn: DebounceFunction, delay: number) {
  let timer: NodeJS.Timeout | null = null
  return function (this: unknown, ...args: unknown[]) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn.apply(this, args)
    }, delay)
  }
}
