/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function LineConfig({ isShow, kind }) {
  const bodyStyle = css({
    width: '100vw',
    height: '100vh',
    display: isShow ? 'block' : 'none',
  })

  return (
    <>
      {isShow && <div css={bodyStyle}>
        {kind === 'speech' && <div>音声編集</div>}
      </div>
      }
    </>
  )
}6