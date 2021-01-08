import { useState, useEffect } from 'react'

export default function useVoiceRecorder(id, token, recording, setRecord) {
  const [isTalking, setIsTalking] = useState(false)
  const [config, setConfig] = useState()
  /*
  useEffect(async () => {
    const voiceRecorder = new VoiceRecorder(id, voice => {
      setRecord('voice', voice)
    }, talking => {
      setTalking(talking)
    })

    voiceRecorder.start(recording)

    return function terminateRecorder() {
      voiceRecorder.turnOff()
    }
    //    return
  }, [recording, config])

*/
  return { isTalking, setVoiceRecorderConfig: setConfig }
}