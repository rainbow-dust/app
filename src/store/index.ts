// 只是放一下全局变量...

// js 运行时与 localStorage 里的数据的同步...emm这有意义吗....
export const useUserInfo = () => {
  let username: string | null | undefined, token: string | null | undefined
  return function () {
    if (
      localStorage.getItem('token') !== token ||
      localStorage.getItem('username') !== username
    ) {
      username = localStorage.getItem('username')
      token = localStorage.getItem('token')
    }
    return { username, token }
  }
}
