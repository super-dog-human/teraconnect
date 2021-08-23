import { useRef, useState, useEffect } from 'react'
import useAudioInputDevices from '../../useAudioInputDevices'
import useVoiceRecorder from '../useVoiceRecorder'
import { useRouter } from 'next/router'
import { voiceURL } from '../../../speechUtils'

export default function useHumanVoiceRecorder(config, dispatchConfig) {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const [isRecording, setIsRecording] = useState(false)
  const { deviceOptions } = useAudioInputDevices()
  const { isMicReady, setMicDeviceID, voiceFile } = useVoiceRecorder({ needsUpload: false, isRecording })

  function handleRecording() {
    setIsRecording(status => !status)
  }

  function handleMicChange(e) {
    setMicDeviceID(e.target.value)
  }

  function updateAudioURL(url) {
    dispatchConfig({ type: 'url', payload: url })
  }

  useEffect(() => {
    if (config.voiceID === 0) return
    updateAudioURL(voiceURL(lessonIDRef.current, config.voiceID, config.voiceFileKey))
  }, [])

  useEffect(() => {
    if (deviceOptions.length === 0) return

    setMicDeviceID(deviceOptions[0].value)
  }, [deviceOptions])

  useEffect(() => {
    if (!voiceFile) return

    const url = URL.createObjectURL(voiceFile)
    updateAudioURL(url)
  }, [voiceFile])

  return { deviceOptions, isMicReady, isRecording, handleMicChange, handleRecording }
}