/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function TabListWithCloseButton({ onClose, color, children }) {
  const tabListStyle = css({
    '.react-tabs__tab': {
      bottom: '0',
      border: 'none',
      backgroundColor: 'inherit',
      backdropFilter: 'brightness(150%)',
      filter: 'brightness(80%)',
      // 26pxはタブのborderとpaddingの左右合計値
      width: `calc((100% - ${children.length * 26}px - 36px) / ${children.length})`,
      color,
    },
    '.react-tabs__tab--selected': {
      backdropFilter: 'none',
      filter: 'none',
    },
    '.react-tabs__tab:focus:after': {
      background: 'inherit',
    }
  })

  return (
    <div css={tabListStyle}>
      {children}
      <button css={closeButtonStyle} onClick={onClose}><img src="/img/icon/close.svg" css={imageStyle}/></button>
    </div>
  )
}

const closeButtonStyle = css({
  width: '36px',
  height: '36px',
  border: 'none',
  ':hover': {
    filter: 'brightness(70%)',
  },
})

const imageStyle = css({
  width: '10px',
  height: '10px',
})