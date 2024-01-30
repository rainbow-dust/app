import { useEffect, useRef } from 'react'
import ReactDOM, { createRoot } from 'react-dom/client'

import Classes from './index.module.css'

interface MessageProps {
  message: string
  type: 'success' | 'error' | 'warning'
  id: string
}

const TypeToIcon = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
}

const CONTAINER_ID = 'dioda-message__container'
const MESSAGE_QUEUE: Array<MessageProps> = []

// 创建容器
function createContainer() {
  let container = document.getElementById(CONTAINER_ID)
  if (!container) {
    container = document.createElement('div')
    container.setAttribute('id', CONTAINER_ID)
    document.body.appendChild(container)
  }
  return container
}

// 新增消息
function addMessage(params: MessageProps) {
  const id = uuid(8)
  MESSAGE_QUEUE.push({ ...params, id })
  renderMessage([...MESSAGE_QUEUE])
}

// 移除消息
function removeMessage(id: string) {
  const position = MESSAGE_QUEUE.findIndex((item) => item.id === id)
  MESSAGE_QUEUE.splice(position, 1)
  renderMessage([...MESSAGE_QUEUE])
}

// Message 组件
function BaseMessage(props: MessageProps) {
  const { type, message, id } = props

  const refMessage = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const clear = () => removeMessage(id) // Move the definition of 'clear' inside the useEffect callback or wrap it in its own useCallback hook

    const timer = setTimeout(() => {
      clear()
    }, 3000)

    return () => {
      clearTimeout(timer)
    }
  }, [id])

  return (
    <p ref={refMessage} className={Classes['message']}>
      {TypeToIcon[type]}
      {message}
    </p>
  )
}

// 组件渲染
let containerRoot: ReactDOM.Root
function renderMessage(messageQueue: Array<MessageProps>) {
  const container = createContainer()
  if (!containerRoot) {
    containerRoot = createRoot(container)
  }

  const MessageComponents = messageQueue.map((props) => {
    return <BaseMessage {...props} key={props.id} />
  })

  containerRoot.render(MessageComponents)
}

export const Message = {
  success(message: string) {
    addMessage({ message, type: 'success', id: uuid(8) })
  },
  error(message: string) {
    addMessage({ message, type: 'error', id: uuid(8) })
  },
  warning(message: string) {
    addMessage({ message, type: 'warning', id: uuid(8) })
  },
}

function uuid(number: number) {
  const str = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < number; i++) {
    result += str[Math.floor(Math.random() * str.length)]
  }
  return result
}
