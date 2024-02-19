import { FC, createRef, useContext, useState } from 'react'

import { ReplierContext } from '~/hooks/useReplier'

import Classes from './Replier.module.css'

export const Replier: FC<{
  handleAddComment: (
    content: string,
    rootCommentId?: string,
    meetioneeId?: string,
  ) => void
}> = ({ handleAddComment }) => {
  const [content, setContent] = useState('')
  const { replier, setReplier } = useContext(ReplierContext)

  const inputRef = createRef<HTMLInputElement>()

  const handleClick = () => {
    handleAddComment(content, replier.rootCommentId, replier.meetionee?._id)
    setContent('')
    inputRef.current!.value = ''
  }

  return (
    <div className={replier.isActive ? Classes['replier'] : ''}>
      <label htmlFor="reply">
        {replier.meetionee && <span>@{replier.meetionee.username}</span>}
      </label>

      <input
        type="text"
        placeholder="评论"
        ref={inputRef}
        onFocus={() => {
          setReplier({
            isActive: true,
            rootCommentId: replier.rootCommentId,
            noteId: replier.noteId,
            meetionee: replier.meetionee,
          })
        }}
        onChange={(e) => setContent(e.target.value)}
      />
      {replier.isActive && (
        <div>
          <button onClick={handleClick}>评论</button>
          <button
            onClick={() => {
              setReplier({
                isActive: false,
                rootCommentId: undefined,
                noteId: '',
                meetionee: undefined,
              })
            }}
          >
            取消
          </button>
        </div>
      )}
    </div>
  )
}
