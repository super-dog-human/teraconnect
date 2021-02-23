/** @jsxImportSource @emotion/react */
import React from 'react'
import TopLogoLink from '../../../topLogoLink'
import { css } from '@emotion/core'

export default function LessonEditHeader({ isUploading }) {
  return (
    <header css={headerStyle} className="header-z">
      <div css={bodyStyle}>
        <TopLogoLink color="white" />
        <div css={flexItemStyle}>
          <div>
            編集 {isUploading ? 'loading' : 'ok'}
          </div>
          <div>
            レビュー
          </div>
          <div>
            公開設定
          </div>
        </div>
      </div>
    </header>
  )
}

const headerStyle = css({
  width: '100%',
  backgroundColor: 'var(--dark-gray)',
  position: 'fixed',
  top: 0,
  left: 0,
  userSelect: 'none',
})

const bodyStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1280px',
  height: '77px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const flexItemStyle = css({
  width: '100%',
  textAlign: 'center',
})