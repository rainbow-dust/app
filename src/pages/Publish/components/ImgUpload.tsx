import React from 'react'

import { Pic, upload } from '~/services'

import Classes from './ImgUpload.module.css'

export const ImgUpload: React.FC<{
  picList: Pic[]
  setPicList: React.Dispatch<React.SetStateAction<Pic[]>>
}> = ({ picList, setPicList }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    const tobe = []
    for (let i = 0; i < files.length; i++) {
      const { width, height } = await new Promise<{
        width: number
        height: number
      }>((resolve) => {
        const img = new Image()
        img.onload = () => {
          resolve({ width: img.width, height: img.height })
        }
        img.src = URL.createObjectURL(files[i])
      })

      const { url } = await upload(files[i])
      tobe.push({ url, width, height })
    }

    setPicList([...picList, ...tobe])
  }

  return (
    <>
      <div className={Classes['img-upload']}>
        <div className={Classes['img-upload-item']}>
          <input
            type="file"
            id="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
            style={{
              display: 'none',
            }}
          />

          <label htmlFor="file">
            <div>
              <div className={Classes['img-upload-item-inner']}>+</div>
            </div>
          </label>
        </div>
        {picList.map((pic, index) => (
          <div
            key={index}
            className={Classes['img-upload-item']}
            onClick={() => {
              setPicList(picList.filter((_, i) => i !== index))
            }}
          >
            <img
              src={
                pic.url.startsWith('http')
                  ? pic.url
                  : `http://192.168.2.153:9527${pic.url}`
              }
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              alt={pic.url}
            />
          </div>
        ))}
      </div>
    </>
  )
}
