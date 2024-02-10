// 只是写个工具函数其实不是 hook, datetime 是 default 的
export const getDate = (date: string, type?: 'date' | 'time' | 'datetime') => {
  const d = new Date(date)
  const year = d.getFullYear()
  const month = d.getMonth() + 1
  const day = d.getDate()
  const hour = d.getHours()
  const minute = d.getMinutes()
  const second = d.getSeconds()

  switch (type) {
    case 'date':
      return `${year}-${month}-${day}`
    case 'time':
      return `${hour}:${minute}:${second}`
    case 'datetime':
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
    default:
      return `${year}-${month}-${day} ${hour}:${minute}:${second}`
  }
}
