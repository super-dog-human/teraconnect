/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import { css } from '@emotion/core'
import { Hidden } from 'react-grid-system'
import Draggable from 'react-draggable'
import useAudioVisualizer from '../libs/hooks/useAudioVisualizer'
import useDraggableBounds from '../libs/hooks/useDraggableBounds'

export default function VoiceSpectrum({ micDeviceID, isShow, setIsShow }) {
  const [isHover, setIsHover] = useState(false)
  const draggableRef = useRef(null)
  const canvasRef = useRef(null)
  const { bounds, setBounds } = useDraggableBounds()
  useAudioVisualizer(micDeviceID, canvasRef)

  const bodyStyle = css({
    display: isShow ? 'block' : 'none',
    position: 'absolute',
    top: 30,
    bottom: 0,
    left: 30,
    right: 0,
    width: '200px',
    height: '90px',
    backgroundColor: 'black',
    opacity: 0.6,
    borderRadius: '5px',
    cursor: 'pointer',
  })

  const closeButtonStyle = css({
    position: 'absolute',
    top: 0,
    right: 0,
    opacity: isHover ? 1 : 0,
    '>img': {
      display: 'block',
      width: '10px',
      height: '10px',
    },
  })

  function handleMouseEnter() {
    setIsHover(true)
  }

  function handleMouseLeave() {
    setIsHover(false)
  }


  function handleCloseClick() {
    setIsShow(!isShow)
  }

  useEffect(() => {
    setBounds(draggableRef)
  }, [setBounds])

  return (
    <Hidden xs sm>
      <Draggable bounds={bounds}>
        <div ref={draggableRef} css={bodyStyle} className="overay-ui-z" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          <canvas css={spectrumStyle} ref={canvasRef} />
          <button onClick={handleCloseClick} css={closeButtonStyle}>
            <img src="/img/icon/close-bold.svg" draggable="false" alt='マイクスペアナ非表示ボタン' />
          </button>
        </div>
      </Draggable>
    </Hidden>
  )
}

const spectrumStyle = css({
  position: 'relative',
  width: '100%',
  height: '100%',
})