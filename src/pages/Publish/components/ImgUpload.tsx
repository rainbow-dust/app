import React from 'react'

import './ImgUpload.module.css'

import { Pic, upload } from '~/services'

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
      <div
        style={{
          display: 'inline-block',
        }}
      >
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

        <label htmlFor="file" style={{ cursor: 'pointer' }}>
          <div
            style={{
              width: '100px',
              height: '100px',
              border: '1px solid black',
              margin: '5px',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
              }}
            >
              +
            </div>
          </div>
        </label>
      </div>
      {picList.map((pic, index) => (
        <div
          key={index}
          style={{
            display: 'inline-block',
            width: '100px',
            height: '100px',
            border: '1px solid black',
            margin: '5px',
            position: 'relative',
          }}
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
              width: '100px',
              height: '100px',
              objectFit: 'cover',
            }}
            alt={pic.url}
          />
        </div>
      ))}
    </>
  )
}
