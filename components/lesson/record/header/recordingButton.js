/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { useLessonRecorderContext } from '../../../../libs/contexts/lessonRecorderContext'
import RecordingIcon from './recordingIcon'
import ElapsedTime from './elapsedTime'

const maxRecordableSeconds = 600

export default function RecordingButton({ isMicReady }) {
  const [isRecordable, setIsRecordable] = useState(false)
  const [hasRecordingStarted, setHasRecordingStarted] = useState(false)
  const { isRecording, setIsRecording, elapsedSeconds, switchCounter, finishRecording } = useLessonRecorderContext()

  function handleSwitchRecordingClick() {
    if (isRecording) setHasRecordingStarted(true) // 初めての録画停止操作でtrueにする

    switchCounter(!isRecording)
    setIsRecording(!isRecording)
  }

  function handleFinishRecordingClick() {
    if (!hasRecordingStarted) return
    finishRecording()
  }

  useEffect(() => {
    const reachedMaxRecordingSeconds = elapsedSeconds >= maxRecordableSeconds

    if (isMicReady && !reachedMaxRecordingSeconds) {
      setIsRecordable(true)
    } else {
      setIsRecordable(false)
    }

    if (reachedMaxRecordingSeconds) {
      setIsRecording(false)
    }

  }, [isMicReady, elapsedSeconds])

  const finishRecordingStyle = css({
    opacity: hasRecordingStarted ? 0.3 : 0,
    [':hover']: {
      opacity: hasRecordingStarted ? 1 : 0,
    },
    ['> img']: {
      width: '22px',
      height: '22px',
    }
  })


  return (
    <div css={bodyStyle}>
      <div css={sideRecordingButtonStyle} onClick={handleFinishRecordingClick}>
        <div css={finishRecordingStyle}>
          <button css={buttonStyle} disabled={!hasRecordingStarted}>
            <div css={recordingIconStyle}>
              <img src="/img/icon/tick.svg" />
            </div>
          </button>
          <span css={finishRecordTextStyle}>収録を終わる</span>
        </div>
      </div>
      <div onClick={handleSwitchRecordingClick}>
        <button css={buttonStyle} disabled={!isRecordable}>
          <div css={recordingIconStyle}>
            <RecordingIcon recording={isRecording} />
          </div>
        </button>
      </div>
      <div css={sideRecordingButtonStyle} onClick={handleSwitchRecordingClick}>
        <ElapsedTime elapsedSeconds={elapsedSeconds} />
      </div>
    </div>
  )
}

const bodyStyle = css({
  display: 'flex',
  justifyContent: 'center',
})

const sideRecordingButtonStyle = css({
  flexShrink: 0,
  cursor: 'pointer',
  textAlign: 'left',
  width: '140px',
})

const buttonStyle = css({
  ['img']: {
    width: '26px',
    height: 'auto',
    verticalAlign: 'middle',
  },
  [':hover']: {
    backgroundColor: 'var(--text-gray)',
  },
  [':disabled']: {
    opacity: 0.3,
  },
})

const recordingIconStyle = css({
  width: '26px',
  height: '26px',
})

const finishRecordTextStyle = css({
  fontSize: '12px',
  lineHeight: '40px',
  color: 'lightGray',
})