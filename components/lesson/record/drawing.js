/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonRecordDrawing(props) {
  return (
    <div css={bodyStyle} className='drawing-z'>
      drwaing!!!
    </div>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
})