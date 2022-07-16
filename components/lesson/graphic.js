/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'

export default function LessonGraphic({ graphic }) {
  return (
    <>
      {!!graphic && <div css={bodyStyle} className="image-z">
        <img src={graphic.src} css={imageStyle} alt='図表' />
      </div>}
    </>
  )
}

const bodyStyle = css({
  position: 'absolute',
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
})

const imageStyle = css({
  margin: 'auto',
  width: '90%',
  height: '90%',
  objectFit: 'contain',
})