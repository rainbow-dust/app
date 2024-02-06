import React, { createContext, useState } from 'react'

interface ReplierType {
  isActive: boolean
  noteId: string
  rootCommentId?: string
  meetionee?: {
    username: string
    _id: string
  }
}
export interface ReplierContextType {
  replier: ReplierType
  setReplier: React.Dispatch<React.SetStateAction<ReplierType>>
}

export const ReplierContext = createContext<ReplierContextType>({
  replier: {
    isActive: false,
    noteId: '',
    rootCommentId: undefined,
    meetionee: undefined,
  },
  setReplier: () => {},
})

export const useReplier = () => {
  const [replier, setReplier] = useState({
    isActive: false,
    noteId: '',
    rootCommentId: undefined,
    meetionee: undefined,
  })
  return { replier, setReplier }
}
