/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const LessonAvatar = React.forwardRef(function lessonAvatar(props, ref) {
  return (
    <div css={bodyStyle} className="avatar-z" ref={ref} {...props} />
  )
})

export default LessonAvatar

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  'canvas': {
    ':focus': {
      outline: 'none',
    }
  },
})