import React from 'react'

import './ImgUpload.module.css'

import { upload } from '~/services'

export const ImgUpload: React.FC<{
  fileUrls: string[]
  setFileUrls: React.Dispatch<React.SetStateAction<string[]>>
}> = ({ fileUrls, setFileUrls }) => {
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const { url } = await upload(file)
    setFileUrls([...fileUrls, url])
  }

  return (
    <>
      <label htmlFor="file">Files:</label>
      <input type="file" id="file" onChange={handleFileChange} />
      <div>
        {fileUrls.map((url, index) => (
          <div key={index}>
            <img src="" alt={url} />
          </div>
        ))}
      </div>
    </>
  )
}
