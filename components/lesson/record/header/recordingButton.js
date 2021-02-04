/** @jsxImportSource @emotion/react */
import React, { useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { useLessonRecorderContext } from '../../../../libs/contexts/lessonRecorderContext'
import RecordingIcon from './recordingIcon'
import ElapsedTime from './elapsedTime'

const maxRecordableSeconds = 600

export default function RecordingButton({ isMicReady }) {
  const [isRecordable, setIsRecordable] = useState(false)
  const { isRecording, setIsRecording, elapsedSeconds, switchCounter } = useLessonRecorderContext()

  function handleRecording() {
    switchCounter(!isRecording)
    setIsRecording(!isRecording)
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

  return (
    <button onClick={handleRecording} css={recordingButtonStyle} disabled={!isRecordable}>
      <div css={recordingIconStyle}>
        <RecordingIcon recording={isRecording} />
      </div>
      <ElapsedTime isRecording={isRecording} elapsedSeconds={elapsedSeconds} />
    </button>
  )
}

const recordingButtonStyle = css({
  position: 'relative',
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