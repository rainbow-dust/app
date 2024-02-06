import React, { FC } from 'react'

import type { Pic } from '~/services'

export const ContentPics: FC<{ pic_list?: Pic[] }> = ({ pic_list }) => {
  return (
    <>
      {pic_list?.map((pic, i) => (
        <img
          style={{
            maxWidth: '100%',
            maxHeight: '50vh',
          }}
          key={i}
          src={'http://192.168.2.153:9527' + pic.url}
          alt="url"
        />
      ))}
    </>
  )
}
