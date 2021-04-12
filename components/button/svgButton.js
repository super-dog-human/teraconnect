/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function SVGButton({ children, backgroundColor='inherit', color='inherit', borderColor='inherit', padding='0', onClick }) {
  const bodyStyle = css({
    display: 'block',
    width: '100%',
    height: '100%',
    padding: `${padding}px`,
    borderColor,
    backgroundColor,
    color,
    ':hover': {
      filter: 'brightness(80%)',
    },
  })

  return (
    <button onClick={onClick} css={bodyStyle}>
      {children}
    </button>
  )
}