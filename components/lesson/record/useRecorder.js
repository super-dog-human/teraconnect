import { useState } from 'react'

export default function useRecorder(id, token, backgroungImage, avatarConfig) {
  const [isRecording, setIsRecording] = useState(false)

  function setRecord(record) {
    console.log('new record: ', record)
  }


  return { isRecording, setIsRecording, setRecord }
}