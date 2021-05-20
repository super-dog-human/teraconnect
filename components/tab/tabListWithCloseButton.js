/** @jsxImportSource @emotion/react */
import React from 'react'
import Container from '../container'
import IconButton from '../button/iconButton'
import { css } from '@emotion/core'

export default function TabListWithCloseButton({ onClose, color, disabled, children }) {
  const tabListStyle = css({
    '.react-tabs__tab': {
      border: 'none',
      backgroundColor: 'inherit',
      // 24pxはタブのborderとpaddingの左右合計値
      width: `calc((100% - ${children.length * 24}px - 36px) / ${children.length})`,
      color,
      opacity: 0.7,
    },
    '.react-tabs__tab--selected': {
      borderBottom: '1px solid',
      backdropFilter: 'none',
      opacity: 1,
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
      <Container width='36' height='36' display='inline-block'>
        <IconButton name={'close'} padding='10' onClick={onClose} disabled={disabled} />
      </Container>
    </div>
  )
}