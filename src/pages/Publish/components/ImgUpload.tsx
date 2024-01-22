import React from 'react'

import './ImgUpload.module.css'

import { Pic, upload } from '~/services'

export const ImgUpload: React.FC<{
  picList: Pic[]
  setPicList: React.Dispatch<React.SetStateAction<Pic[]>>
}> = ({ picList, setPicList }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const { width, height } = await new Promise<{
      width: number
      height: number
    }>((resolve) => {
      const img = new Image()
      img.onload = () => {
        resolve({ width: img.width, height: img.height })
      }
      img.src = URL.createObjectURL(file)
    })

    console.log('????', width, height)

    const { url } = await upload(file)
    setPicList([...picList, { url, width, height }])
  }

  return (
    <>
      <label htmlFor="file">Files:</label>
      <input type="file" id="file" onChange={handleFileChange} />
      <div>
        {picList.map((pic, index) => (
          <div key={index}>
            <img src="" alt={pic.url} />
          </div>
        ))}
      </div>
    </>
  )
}
