/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useErrorDialogContext } from '../libs/contexts/errorDialogContext'

export default function ErrorDialog() {
  const { error, resolveError } = useErrorDialogContext()

  function handleDismiss() {
    resolveError(error.dismissCallback)
  }

  function handleCallback() {
    resolveError(error.callback)
  }

  return (
    <>
      {error &&
        <div css={backgroundStyle} className="fullscreen-dialog-z">
          <div css={dialogStyle}>
            <div css={headerStyle}>
              <img src={error.side === 'global' ? '/img/icon/server-error.svg' : '/img/icon/error.svg'} />
              <span>{error.side === 'global' ? '不明なエラー' : '処理エラー' }</span>
            </div>
            <div css={bodyStyle}>
              <div css={errorMessageStyle}>
                {error.message}
              </div>
              <div css={errorNameStyle}>
                {error.original.stack}<br />
              </div>
            </div>
            <div css={footerStyle}>
              {error.canDismiss && <button className="light" onClick={handleDismiss}>{error.dismissName || 'キャンセル' }</button>}
              {error.callback && <button className="dark" onClick={handleCallback}>{error.callbackName || '再試行'}</button>}
            </div>
          </div>
        </div>
      }
    </>
  )
}

const backgroundStyle = css({
  display: 'block',
  width: '100%',
  height: '100%',
  position: 'fixed',
  backdropFilter: 'blur(10px)',
  backgroundColor: 'rgba(255, 255, 255, 0.9)',
})

const dialogStyle = ({
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
  padding: '0px',
  '>img': {
    width: 'auto',
    height: '24px',
    verticalAlign: 'middle',
    marginLeft: '20px',
  },
  '>span': {
    color: 'var(--border-gray)',
    fontSize: '16px',
    lineHeight: '50px',
    marginLeft: '15px',
  }
})

const bodyStyle = css({
  width: '80%',
  maxWidth: '650px',
  height: '80%',
  maxHeight: '280px',
  margin: 'auto',
  marginTop: '10%',
})

const errorMessageStyle = css({
  fontSize: '17px',
  color: 'var(--text-gray)',
  marginBottom: '30px',
})

const errorNameStyle = css({
  fontSize: '14px',
  color: 'var(--error-red)',
  height: '40%',
  overflowX: 'scroll',
})

const footerStyle = css({
  display: 'flex',
  justifyContent: 'space-around',
  '>button': {
    width: '100px',
    fontSize: '15px',
  }
})