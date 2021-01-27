/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect } from 'react'
import useAudioVisualizer from '../../../libs/hooks/useAudioVisualizer'
import { css } from '@emotion/core'
import Draggable from 'react-draggable'
import useDraggableBounds from '../../../libs/hooks/useDraggableBounds'

export default function LessonRecordVoiceSpectrum({ micDeviceID, isShow, setIsShow }) {
//  const [isShow, setIsShow] = useState(true)
  const draggableRef = useRef(null)
  const canvasRef = useRef(null)
  const { bounds, setBounds } = useDraggableBounds()
  useAudioVisualizer(micDeviceID, canvasRef)

  const bodyStyle = css({
    display: isShow ? 'block' : 'block',
    position: 'absolute',
    top: 30,
    bottom: 0,
    left: 30,
    right: 0,
    width: '230px',
    height: '130px',
    backgroundColor: 'black',
    opacity: 0.6,
    borderRadius: '5px',
    cursor: 'pointer',
  })


  function handleCloseClick() {
    setIsShow(!isShow)
  }

  useEffect(() => {
    setBounds(draggableRef)
  }, [])

  return (
    <Draggable bounds={bounds}>
      <div ref={draggableRef} css={bodyStyle} className="overay-ui-z">
        <canvas css={spectrumStyle} ref={canvasRef} />
        <button onClick={handleCloseClick} css={closeButtonStyle}>
          <img src="/img/icon/close.svg" draggable="false" />
        </button>
      </div>
    </Draggable>
  )
}

const closeButtonStyle = css({
  position: 'absolute',
  top: 0,
  right: 0,
  ['>img']: {
    display: 'block',
    width: '10px',
    height: '10px',
  },
})

const spectrumStyle = css({
  position: 'relative',
  width: '100%',
  height: '100%',
})