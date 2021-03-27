/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function IconButton({ name, backgroundColor='inherit', color='inherit', borderColor='inherit', padding='0', onClick }) {
  const bodyStyle = css({
    display: 'block',
    width: '100%',
    height: '100%',
    padding: `${padding}px`,
    fontSize: 0,
    borderColor,
    backgroundColor,
    color,
    ':hover': {
      filter: 'brightness(110%)',
    },
  })

  return (
    <button onClick={onClick} css={bodyStyle}>
      <img src={`/img/icon/${name}.svg`} onClick={onClick} draggable={false} css={imageStyle} />
    </button>
  )
}

const imageStyle = css({
  width: '100%',
  height: '100%',
})