/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useDialogContext } from '../libs/contexts/dialogContext'

export default function Dialog() {
  const { dialog, dismissDialog } = useDialogContext()

  function handleDismiss() {
    dismissDialog(dialog.dismissCallback)
  }

  function handleCallback() {
    dismissDialog(dialog.callback)
  }

  return (
    <>
      {dialog &&
        <div css={backgroundStyle} className="fullscreen-dialog-z">
          <div css={dialogStyle}>
            <div css={headerStyle}>
              <img src="/img/icon/information.svg" />
              <span>{dialog.title || 'お知らせ'}</span>
            </div>
            <div css={bodyStyle}>
              {dialog.message}
            </div>
            <div css={footerStyle}>
              {dialog.canDismiss && <button className="dark" onClick={handleDismiss}>{dialog.dismissName || '閉じる' }</button>}
              {dialog.callback && <button className="dark" onClick={handleCallback}>{dialog.callbackName || '実行'}</button>}
            </div>
          </div>
        </div>
      }
    </>
  )
}

const backgroundStyle = css({
  position: 'absolute',
  display: 'block',
  width: '100%',
  height: '100%',
})

const dialogStyle = ({
  backgroundColor: 'white',
  filter: 'drop-shadow(2px 2px 5px gray)',
  width: '70%',
  maxWidth: '500px',
  height: '30%',
  maxHeight: '400px',
  margin: 'auto',
  marginTop: '5%',
})

const headerStyle = ({
  width: '95%',
  height: '50px',
  borderBottom: '1px solid var(--soft-white)',
  padding: '0px',
  ['>img']: {
    width: 'auto',
    height: '24px',
    verticalAlign: 'middle',
    marginLeft: '20px',
  },
  ['>span']: {
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

const footerStyle = css({
  display: 'flex',
  justifyContent: 'space-around',
  ['>button']: {
    width: '100px',
    fontSize: '15px',
  }
})