import { useRef, useState, useEffect } from 'react'
import useAudioInputDevices from '../../useAudioInputDevices'
import useVoiceRecorder from '../useVoiceRecorder'
import { useRouter } from 'next/router'
import useFetch from '../../useFetch'

export default function useHumanVoiceRecorder(config, dispatchConfig) {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const [isRecording, setIsRecording] = useState(false)
  const { deviceOptions } = useAudioInputDevices()
  const { isMicReady, setMicDeviceID, voiceFile } = useVoiceRecorder({ needsUpload: false, isRecording })
  const { fetchVoiceFileURL } = useFetch()

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

    fetchVoiceFileURL(config.voiceID, lessonIDRef.current)
      .then(voice => updateAudioURL(voice.url))
      .catch(e => {
        if (e.name === 'AbortError') return
        if (e.name === 'TimeoutError') return
      })
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