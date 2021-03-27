/** @jsxImportSource @emotion/react */
import React from 'react'
import IconButton from '../button/iconButton'
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
    '.react-tabs__tab:focus': {
      boxShadow: 'none',
      outline: '2px dotted gray',
    },
    '.react-tabs__tab:focus:after': {
      content: 'none',
      background: 'inherit',
    }
  })

  return (
    <div css={tabListStyle}>
      {children}
      <div css={buttonStyle}>
        <IconButton name={'close'} padding='10' onClick={onClose} borderColor='var(--dark-gray)' />
      </div>
    </div>
  )
}

const buttonStyle = css({
  display: 'inline-block',
  width: '36px',
  height: '36px',
})