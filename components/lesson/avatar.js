/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonAvatar({ avatarRef }) {
  return (
    <div css={bodyStyle} className='avatar-z' ref={avatarRef} />
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
})