/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import { css } from '@emotion/core'
import Speech from './speech/'

export default function LineConfig({ config }) {
  const[isShow, setIsShow] = useState(false)

  function handleClose() {
    setIsShow(false)
    config.closeCallback()
  }

  useEffect(() => {
    if (Object.keys(config).length > 0) {
      setIsShow(true)
    } else {
      setIsShow(false)
    }
  }, [config])

  return (
    <>
      {isShow && <div css={backgroundStyle} className="modal-panel-z">
        <Draggable handle=".drag-handle">
          <div css={bodyStyle}>
            {config.kind === 'speech' && <Speech config={config} closeCallback={handleClose} />}
          </div>
        </Draggable>
      </div>}
    </>
  )
}

const backgroundStyle = css({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
})

const bodyStyle = css({
  position: 'absolute',
  top: '30%',
  left: 'calc(50% - 100px)',
  backgroundColor: 'var(--dark-gray)',
  width: '80%',
  maxWidth: '700px',
  borderRadius: '5px',
  filter: 'drop-shadow(2px 2px 2px gray)',
})