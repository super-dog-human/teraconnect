/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { useLessonRecorderContext } from '../../../../libs/contexts/lessonRecorderContext'
import RecordingIcon from './recordingIcon'
import ElapsedTime from './elapsedTime'

const maxRecordableSeconds = 600

export default function RecordingButton({ lessonID, isMicReady }) {
  const [isRecordable, setIsRecordable] = useState(false)
  const [hasRecordingStarted, setHasRecordingStarted] = useState(false)
  const { isRecording, setIsRecording, isFinishing, elapsedSeconds, switchCounter, finishRecording } = useLessonRecorderContext()

  function handleSwitchRecordingClick() {
    if (!isRecordable) return
    if (isFinishing) return
    if (isRecording) setHasRecordingStarted(true) // 収録を停止したタイミングで収録済みフラグを立てる

    switchCounter(!isRecording)
    setIsRecording(!isRecording)
  }

  function handleFinishRecordingClick() {
    if (!hasRecordingStarted) return
    if (isFinishing) return
    finishRecording(lessonID)
  }

  useEffect(() => {
    const reachedMaxRecordingSeconds = elapsedSeconds >= maxRecordableSeconds

    if (isMicReady && !reachedMaxRecordingSeconds) {
      setIsRecordable(true)
    } else {
      setIsRecordable(false)
    }

    if (reachedMaxRecordingSeconds) {
      switchCounter(false)
      setIsRecording(false)
      setHasRecordingStarted(true)
    }

  }, [isMicReady, elapsedSeconds])

  const finishRecordingStyle = css({
    width: '140px',
    opacity: !isRecording && hasRecordingStarted ? 0.3 : 0,
    ':hover': {
      opacity: isFinishing ? 0.3 : !isRecording && hasRecordingStarted ? 1 : 0,
    },
    '> img': {
      width: '22px',
      height: '22px',
    }
  })

  const sideRecordingButtonStyle = css({
    flexShrink: 0,
    cursor: isFinishing ? 'default' : 'pointer',
    textAlign: 'left',
  })

  const elapsedTimeStyle = css({
    width: '100px',
    flexShrink: 0,
    cursor: isFinishing ? 'default' : 'pointer',
    textAlign: 'left',
  })

  return (
    <div css={bodyStyle}>
      <div css={sideRecordingButtonStyle} onClick={handleFinishRecordingClick}>
        <div css={finishRecordingStyle}>
          <button css={buttonStyle} disabled={isRecording || !hasRecordingStarted || isFinishing}>
            <div css={recordingIconStyle}>
              <img src="/img/icon/tick.svg" />
            </div>
          </button>
          <span css={finishRecordTextStyle}>収録を終わる</span>
        </div>
      </div>
      <div onClick={handleSwitchRecordingClick}>
        <button css={buttonStyle} disabled={!isRecordable || isFinishing}>
          <div css={recordingIconStyle}>
            <RecordingIcon recording={isRecording} />
          </div>
        </button>
      </div>
      <div css={elapsedTimeStyle} onClick={handleSwitchRecordingClick}>
        <ElapsedTime elapsedSeconds={elapsedSeconds} />
      </div>
    </div>
  )
}

const bodyStyle = css({
  display: 'flex',
  justifyContent: 'center',
})

const buttonStyle = css({
  'img': {
    width: '26px',
    height: 'auto',
    verticalAlign: 'middle',
  },
  ':hover': {
    backgroundColor: 'var(--text-gray)',
  },
  ':disabled': {
    opacity: 0.3,
    cursor: 'default',
    backgroundColor: 'var(--dark-gray)',
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