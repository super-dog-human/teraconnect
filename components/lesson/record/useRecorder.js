import { useState } from 'react'

export default function useRecorder(id, token, backgroungImage, avatarConfig) {
  const [recording, setRecording] = useState(false)

  function setRecord(record) {
    console.log('new record: ', record)
  }


  return { recording, startRecording: setRecording, setRecord }
}