/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'

export default function LessonBackgroundImage(props) {
  return (
    <div css={bodyStyle} className="bg-image-z">
      {props.src && <Image {...props} width={1280} height={720} />}
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  fontSize: 0, // next/imageで出力されるトップレベルの要素がinline-blockなので余白をなくすために指定
})