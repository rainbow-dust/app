import { Feed } from '~/components/Feed'

export const Explore = () => {
  const initNoteList = () => {
    const arr = new Array(100).fill(0).map((_, index) => {
      return {
        id: index,
        content: `content${index}`,
      }
    })
    return arr
  }

  let page = 10
  const loadMore = async () => {
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve()
      }, 1000)
    })
    const arr = new Array(10).fill(0).map((_, index) => {
      return {
        id: index + page * 10,
        content: `content${index + page * 10}`,
      }
    })
    page += 1
    return arr
  }
  return (
    <div>
      <Feed initNoteList={initNoteList()} loadMore={loadMore} />
    </div>
  )
}
