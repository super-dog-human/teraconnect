/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { useClientErrorDialogContext } from '../libs/contexts/clientErrorDialogContext'

export default function ClientErrorDialog({ children }) {
  const [isDisplay, setIsDisplay] = useState(false)
  const { clientError, setClientError } = useClientErrorDialogContext()

  useEffect(() => {
    if (Object.keys(clientError).length === 0) {
      setIsDisplay(false)
    } else {
      setIsDisplay(true)
    }
  }, [clientError])

  const backgroundStyle = css({
    display: isDisplay ? 'block' : 'none',
    width: '100%',
    height: '100%',
    position: 'absolute',
    left: 0,
    backdropFilter: 'blur(10px)',
    backgroundColor: 'white',
    opacity: 0.9,
  })

  return (
    <>
      <div css={backgroundStyle} className="fullscreen-dialog-z">
        <div>{clientError.title}</div>
        <div>{clientError.message}</div>
      </div>
      { children }
    </>
  )
}