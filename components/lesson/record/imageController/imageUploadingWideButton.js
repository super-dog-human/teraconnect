/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ImageUploadingIcon from './imageUploadingIcon'

export default function ImageUploadingWideButton({ hasDragOver, onDragOver,onDragLeave, onDrop, onClick }) {
  const buttonStyle = css({
    display: 'block',
    width: '600px',
    height: '60px',
    backgroundColor: hasDragOver ? 'var(--dark-purple)' : 'inherited',
    margin: 'auto',
    cursor: 'pointer',
    color: 'white',
    border: '2px var(--border-gray) dashed',
    borderStyle: 'dashed',
    [':hover']: {
      opacity: 0.6,
    },
    ['>img']: {
      verticalAlign: 'middle',
      marginRight: '30px',
    },
    ['>span']: {
      fontSize: '15px',
      lineHeight: '15px',
      verticalAlign: 'middle',
    },
  })

  return (
    <div css={bodyStyle}>
      <button css={buttonStyle} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop} onClick={onClick}>
        <ImageUploadingIcon />
        <span>画像をアップロードして、授業内で表示できます。</span>
      </button>
    </div>
  )
}

const bodyStyle = css({
  paddingTop: '30px',
})