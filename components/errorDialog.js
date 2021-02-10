/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { useErrorDialogContext } from '../libs/contexts/errorDialogContext'

export default function ErrorDialog({ children }) {
  const [isDisplay, setIsDisplay] = useState(false)
  const { error } = useErrorDialogContext()

  useEffect(() => {
    if (Object.keys(error).length === 0) {
      setIsDisplay(false)
    } else {
      setIsDisplay(true)
    }
  }, [error])

  const backgroundStyle = css({
    display: isDisplay ? 'block' : 'none',
    width: '100%',
    height: '100%',
    position: 'absolute',
    backdropFilter: 'blur(10px)',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  })

  return (
    <>
      <div css={backgroundStyle} className="fullscreen-dialog-z">
        <div css={bodyStyle}>
          <div css={headerStyle}>
            <span>{error.side === 'client' ? 'クライアントエラー' : 'サーバーエラー'}</span>
          </div>
          <div css={detailStyle}>
            <div css={errorMessageStyle}>
              {error.message}
            </div>
            {error.original && <div css={errorNameStyle}>
              {error.original.message}<br />
              {error.original.name}<br />
              {error.original.stack}<br />
            </div>
            }
          </div>
          <div css={footerStyle}>
            {error.retryCallback && <button onClick={error.retryCallback}>リトライ</button>}
            {error.dismissCallback && <button onClick={error.dismissCallback}>閉じる</button>}
          </div>
        </div>
      </div>
      { children }
    </>
  )
}

const bodyStyle = ({
  backgroundColor: 'white',
  filter: 'drop-shadow(2px 2px 5px lightgray)',
  width: '70%',
  maxWidth: '900px',
  height: '80%',
  maxHeight: '500px',
  margin: 'auto',
  marginTop: '5%',
})

const headerStyle = ({
  width: '95%',
  height: '50px',
  borderBottom: '1px solid var(--soft-white)',
  color: 'var(--border-gray)',
  fontSize: '16px',
  lineHeight: '50px',
  padding: '0px',
  ['>span']: {
    marginLeft: '15px',
  }
})

const detailStyle = css({
  width: '80%',
  maxWidth: '650px',
  margin: 'auto',
  marginTop: '10%',
})

const errorMessageStyle = css({
  fontSize: '18px',
  color: 'var(--text-gray)',
  marginBottom: '15px',
})

const errorNameStyle = css({
  fontSize: '16px',
  color: 'var(--error-red)',
})

const footerStyle = css({
  //
})