/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LessonRecordImageController(props) {
  const bodyStyle = css({
    width: '100%',
    height: '120px',
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
  })

  const controllerStyle = css({
    maxWidth: '1280px',
    margin: 'auto',
  })

  return (
    <div css={bodyStyle}>
      <div css={controllerStyle}>
        image controller.
      </div>
    </div>
  )
}
