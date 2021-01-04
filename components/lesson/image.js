/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonImage(props) {
  const bodyStyle = css({
    display: props.loading ? 'none' : 'block',
    objectFit: 'contain',
  })

  return (
    <img src={props.src} css={bodyStyle} />
  )
}
