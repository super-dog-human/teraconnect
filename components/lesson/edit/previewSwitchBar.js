/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'

export default function PreviewSwitchBar({ showPreview, setShowPreview }) {
  function switchPreview() {
    setShowPreview(s => !s)
  }

  const iconStyle = css({
    width: '30px',
    height: 'auto',
    objectFit: 'contain',
    transform: showPreview && 'scale(-1, 1)',
  })

  return (
    <div css={backgroundStyle} className='modal-panel-z'>
      <button css={bodyStyle} onTouchEnd={switchPreview} >
        <img src='/img/flip.png' srcSet='/img/flip.png 1x, /img/flip@2x.png 2x' alt='プレビュー切り替え' css={iconStyle} />
      </button>
    </div>
  )
}

const backgroundStyle = css({
  position: 'fixed',
  right: '10px',
  width: '50px',
  height: '46px',
  backgroundColor: 'var(--dark-purple)',
  borderRadius: '0px 0px 5px 5px',
})

const bodyStyle = css({
  width: '100%',
  height: '100%',
  display: 'flex',
  border: 0,
  justifyContent: 'center',
  alignItems: 'center',
  padding: 0,
  borderRadius: '0px 0px 5px 5px',
})