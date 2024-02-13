import { useEffect, useRef, useState } from 'react'

import Classes from './MuMuEditor.module.css'

export const MuMuEditor: React.FC<{
  content: string
  setContent: (content: string) => void
}> = ({
  content,
  // setContent
}) => {
  // const [content, setContent] = useState()
  // const [innerHTML, setInnerHTML] = useState()
  // const [tags, setTags] = useState<string[]>([])
  // const [users, setUsers] = useState<string[]>([])

  //

  // 标签的文字结构应该是 #原神[标签/话题], @暮暮[用户],渲染是是 a 标签
  // 使用，空格/换行时，如果本段落是以#开头的，就创建一个<a>标签，然后替换掉这个段落。
  // 如果是@开头的，就创建一个a标签，然后替换掉这个段落。

  // 外层拿到的应该是 mark 的字符串

  const [lastHtml, setLastHtml] = useState(content)

  const handleContentChange = (e: React.ChangeEvent<HTMLDivElement>) => {
    // 这里拿到的 html...可能有很多嵌套.但功能是不需要嵌套的，弄平
    const strs = e.target.innerHTML.split(/[\n\s]/)
    let _html = e.target.innerHTML

    strs.forEach((str) => {
      if (str.startsWith('#')) {
        const a = document.createElement('a')
        a.contentEditable = 'false'
        a.href = `/tag/${str.slice(1)}`
        a.innerText = str
        _html = _html.replace(str, a.outerHTML)
      }
    })
    setLastHtml(_html)
  }
  return (
    <>
      <ContentEditable html={lastHtml} onChange={handleContentChange} />
    </>
  )
}

const ContentEditable: React.FC<{
  html: string
  onChange: (e: React.ChangeEvent<HTMLDivElement>) => void
}> = ({ html, onChange }) => {
  // 这一层...只实现默认、基本的展示编辑，不做功能性的处理

  // 我明白了... 这个组件如果这么写，其实是属于..失控了许多的。onChange 只是修改外部变量，而这样写外部变量的改变已经显示不到这里了。
  // 重新渲染会导致丢失光标位置，而如果不重新渲染，就纯纯的脱离联系没有反馈...

  // ...也许真的需要，记忆光标位置，插入，复原光标位置，这样做的话... react 真是多余。我就说 jquery 天下无敌。

  // getSelection(), createRange(),
  // lastCarets.current = window.getSelection().getRangeAt(0).cloneRange()
  // 不过它要真刷新了...这样记忆还有用吗。

  const lastHtml = useRef(html)
  const textarea = useRef<HTMLDivElement>(null)
  const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
    onChange(e as unknown as React.ChangeEvent<HTMLDivElement>)
  }

  useEffect(() => {
    if (textarea.current) {
      textarea.current.innerHTML = html
    }
  }, [html])

  return (
    <>
      <div
        contentEditable
        id="content"
        // placeholder="添加正文"
        // data-tribute={true}
        className={Classes['mumu-editor']}
        onInput={handleInput}
        ref={textarea}
        dangerouslySetInnerHTML={{ __html: lastHtml.current }}
      ></div>
      {lastHtml.current}
    </>
  )
}
