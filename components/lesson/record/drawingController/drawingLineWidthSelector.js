/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Container from '../../../container'

export default function DrawingLineSelector({ lineWidth, height, selected, onClick }) {
  const buttonStyle = css({
    width: '100%',
    height: '20px',
    backgroundColor: selected ? 'gray' : 'var(--dark-gray)',
  })

  const lineStyle = css({
    width: '100%',
    height: `${height}px`,
    backgroundColor: 'var(--soft-white)',
  })

  return (
    <Container>
      <button css={buttonStyle} onClick={onClick} data-width={lineWidth}>
        <div css={lineStyle} data-width={lineWidth} />
      </button>
    </Container>
  )
}