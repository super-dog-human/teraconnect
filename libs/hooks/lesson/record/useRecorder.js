import { useState } from 'react'

export default function useRecorder(id, token, isRecording) {
  function setRecord(record) {
    if (!isRecording) return

    console.log('new record: ', record)
  }

  return { setRecord }
}