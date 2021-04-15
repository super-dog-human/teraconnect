import { useState, useEffect } from 'react'
import useAudioInputDevices from '../../useAudioInputDevices'
import useVoiceRecorder from '../useVoiceRecorder'
import useAudioPlayer from '../../useAudioPlayer'
import { useRouter } from 'next/router'
import { fetchWithAuth } from '../../../fetch'

export default function useSpeechVoice(config, setConfig) {
  const router = useRouter()
  const [audioURL, setAudioURL] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const { deviceOptions, requestMicPermission } = useAudioInputDevices()
  const { isMicReady, setMicDeviceID, voiceFile } = useVoiceRecorder({ needsUpload: false, isRecording })
  const { isPlaying, createAudio, switchAudio, seekAudio, audioElapsedTime, audioDuration, audioCurrent } = useAudioPlayer()

  function handleRecording() {
    setIsRecording(status => !status)
  }

  function handleMicChange(e) {
    setMicDeviceID(e.target.value)
  }

  function handleAudioPlay() {
    switchAudio()
  }

  function handleSeek(e) {
    seekAudio(e.target.value)
  }

  async function setInitialVoice() {
    const lessonID = parseInt(router.query.id)
    const voice = await fetchVoiceFileURL(config.voiceID, lessonID)
    setAudioURL(voice.url)

    function fetchVoiceFileURL(voiceID, lessonID) {
      return fetchWithAuth(`/voices/${voiceID}?lesson_id=${lessonID}`)
        .then(result => result)
        .catch(e  => {
          console.error(e)
        })
    }
  }

  useEffect(() => {
    requestMicPermission()
    setInitialVoice()
  }, [])

  useEffect(() => {
    if (deviceOptions.length === 0) return

    setMicDeviceID(deviceOptions[0].value)
  }, [deviceOptions])

  useEffect(() => {
    createAudio(audioURL)
    setConfig(config => {
      config.url = audioURL
      return { ...config }
    })
  }, [audioURL])

  useEffect(() => {
    if (!voiceFile) return

    const url = URL.createObjectURL(voiceFile)
    setAudioURL(url)
  }, [voiceFile])

  return { deviceOptions, audioElapsedTime, audioDuration, audioCurrent, isMicReady, isPlaying, isRecording, handleMicChange, handleAudioPlay, handleRecording, handleSeek }
}