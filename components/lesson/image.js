/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonImage(props) {
  return (
    <div css={bodyStyle} className="image-z">
      <img src={props.src} css={imageStyle} />
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
})

const imageStyle = css({
  width: '90%',
  height: 'auto',
  objectFit: 'contain',
})