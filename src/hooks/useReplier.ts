import { createContext, useState } from 'react'

interface ReplierType {
  isActive: boolean
  noteId: string
  rootCommentId?: string
  meetionee?: {
    username: string
    _id: string
  }
}
interface ReplierContextType {
  replier: ReplierType
  setReplier: (replier: ReplierType) => void
}

export const ReplierContext = createContext<ReplierContextType>({
  replier: {
    isActive: false,
    noteId: '',
    rootCommentId: undefined,
  },
  setReplier: () => {},
})

export const useReplier = () => {
  const [replier, setReplier] = useState({
    isActive: false,
    noteId: '',
    rootCommentId: undefined,
  })
  return { replier, setReplier }
}
