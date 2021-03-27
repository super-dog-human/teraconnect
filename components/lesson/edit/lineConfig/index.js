/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import Draggable from 'react-draggable'
import FullscreenContainer from '../../../fullscreenContainer'
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
      {isShow && <FullscreenContainer position='fixed' zKind='modal-panel'>
        <Draggable handle=".drag-handle">
          <div css={bodyStyle}>
            {config.kind === 'speech' && <Speech config={config} closeCallback={handleClose} />}
          </div>
        </Draggable>
      </FullscreenContainer>}
    </>
  )
}

const bodyStyle = css({
  backgroundColor: 'var(--dark-gray)',
  position: 'absolute',
  top: '30%',
  left: 'calc(50% - 100px)',
  width: '80%',
  maxWidth: '700px',
  borderRadius: '5px',
  filter: 'drop-shadow(2px 2px 2px gray)',
})