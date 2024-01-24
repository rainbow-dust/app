export const BASE_URL = '/api'
// 应该给一个统一的...把 auth token 和后续的 res.json() 什么的统一处理一下，顺便分一下哪些是需要 auth token 的前端就做一下拦截

export * from './comment'
export * from './upload'
export * from './user'
export * from './note'
export * from './tag'
export * from './notice'
