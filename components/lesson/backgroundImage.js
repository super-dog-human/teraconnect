/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'

export default function LessonBackgroundImage(props) {
  return (
    <>
      {!props.src && <img src='/img/16-9.png' css={placeHolderStyle} className='bg-image-z' />}
      {props.src && <Image {...props} width={1280} height={720} className='bg-image-z' />}
    </>
  )
}

const placeHolderStyle = css({
  objectFit: 'contain',
  width: '100%',
  height: 'auto',
  backgroundColor: 'white',
})