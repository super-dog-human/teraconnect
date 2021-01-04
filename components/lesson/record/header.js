/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { css } from '@emotion/core'

export default function LessonRecordHeader(props) {
  function handleSettingPanel() {
    props.setShowControlPanel(state => !state)
  }

  return (
    <header css={headerStyle} className='header-z'>
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
        <img src="/img/icon/recording.svg" css={{ width: '26px', height: '26px' }} /> <span>停止中</span>
        <img src="/img/icon/hide.svg" css={{ width: '2%', height: 'auto%' }} />
        <img src="/img/icon/drawing.svg" css={{ width: '2%', height: 'auto' }} />
        <img src="/img/icon/trash.svg" css={{ width: '2%', height: 'auto' }} />
        <img src="/img/icon/settings.svg" css={{ width: '20px', height: '20px' }} onClick={handleSettingPanel} />
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