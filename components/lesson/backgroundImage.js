/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'

export default function LessonBackgroundImage(props) {
  return (
    <>
      {!props.src && <img src="/img/16-9.png" css={placeHolderStyle} className="bg-image-z" />}
      {props.src && <Image {...props} width={1280} height={720} className="bg-image-z" css={imageStyle} />}
    </>
  )
}

const placeHolderStyle = css({
  objectFit: 'contain',
  width: '100%',
  height: 'auto',
})

const imageStyle = css({
  fontSize: 0, // next/imageで出力されるトップレベルの要素がinline-blockなので余白をなくすために指定
})