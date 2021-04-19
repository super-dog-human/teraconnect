import { useRef, useState, useEffect } from 'react'
import useAudioInputDevices from '../../useAudioInputDevices'
import useVoiceRecorder from '../useVoiceRecorder'
import { useRouter } from 'next/router'
import { fetchVoiceFileURL } from '../../../fetchResource'

export default function useHumanVoiceRecorder(config, setConfig) {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const [isRecording, setIsRecording] = useState(false)
  const { deviceOptions, requestMicPermission } = useAudioInputDevices()
  const { isMicReady, setMicDeviceID, voiceFile } = useVoiceRecorder({ needsUpload: false, isRecording })

  function handleRecording() {
    setIsRecording(status => !status)
  }

  function handleMicChange(e) {
    setMicDeviceID(e.target.value)
  }

  function updateAudioURL(url) {
    setConfig(config => {
      config.url = url
      return { ...config }
    })
  }

  useEffect(() => {
    requestMicPermission()
    setAudioFromVoiceID()

    async function setAudioFromVoiceID() {
      const voice = await fetchVoiceFileURL(config.voiceID, lessonIDRef.current)
      updateAudioURL(voice.url)
    }
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