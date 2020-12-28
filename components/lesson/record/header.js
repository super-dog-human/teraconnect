/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import Link from 'next/link'
import { jsx, css } from '@emotion/core'

export default function LessonRecordHeader(props) {
  function handleSettingPanel() {
    props.setShow(!props.show)
  }

  return (
    <header css={headerStyle}>
      <div css={headerBodyStyle}>
        <span css={logoStyle}>
          <Link href="/">
            <img
              css={logoImageStyle}
              src="/img/logo.png"
              srcSet="/img/logo.png 1x, /img/logo@2x.png 2x"
            />
          </Link>
        </span>
        <button>録画開始</button>
        <button>非表示</button>
        <button>線を描く</button>
        <button>一括削除</button>
        <button onClick={handleSettingPanel}>設定</button>
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
})

const headerBodyStyle = css({
  maxWidth: '1280px',
  height: '77px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const logoStyle = css({
  verticalAlign: 'middle',
  lineHeight: '77px',
  marginLeft: '20px',
  marginRight: '100px',
})

const logoImageStyle = css({
  width: '181px',
  height: '25px',
  marginLeft: '0px',
  lineHeight: '77px',
  verticalAlign: 'middle',
})