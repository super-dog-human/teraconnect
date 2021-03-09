/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

const BlankLine = React.forwardRef(function blankLine(props, ref) {
  function handleDragOver(e) {
    e.preventDefault()
  }

  function handleDrop(e) {
    props.onDrop(parseInt(e.currentTarget.parentNode.dataset.index))
  }

  return (
    <div css={bodyStyle} ref={ref} onDragOver={handleDragOver} onDrop={handleDrop}></div>
  )
})

const bodyStyle = css({
  width: '100%',
  height: '0',
  borderRadius: '5px',
  backgroundColor: 'var(--dark-purple)',
})

export default BlankLine