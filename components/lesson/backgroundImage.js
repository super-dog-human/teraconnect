/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'

export default function LessonBackgroundImage({ src }) {
  return (
    <div css={bodyStyle} className="bg-image-z">
      {src && <Image src={src} width={1280} height={720} />}
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  fontSize: 0, // next/imageで出力されるトップレベルの要素がinline-blockなので余白をなくすために指定
})