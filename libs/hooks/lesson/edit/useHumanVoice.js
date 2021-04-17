import { useState, useEffect } from 'react'
import useAudioInputDevices from '../../useAudioInputDevices'
import useVoiceRecorder from '../useVoiceRecorder'
import useAudioPlayer from '../../useAudioPlayer'
import { useRouter } from 'next/router'
import { fetchWithAuth } from '../../../fetch'
import { isBlobURL } from '../../../utils'

export default function useHumanVoice(config, setConfig) {
  const router = useRouter()
  const [audioURL, setAudioURL] = useState('')
  const [audioMax, setAudioMax] = useState(0)
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
    if (!voiceFile) return

    const url = URL.createObjectURL(voiceFile)
    setAudioURL(url)
  }, [voiceFile])

  useEffect(() => {
    // audioMaxはrangeのmaxに使用されるが、stepが0.1だと四捨五入した値で最後までシークバーの●が届かない場合があるので切り捨てる
    setAudioMax(Math.floor(audioDuration * 10) / 10)
  }, [audioDuration])

  useEffect(() => {
    createAudio(audioURL)

    setConfig(config => {
      if (config.url && isBlobURL(config.url)) {
        URL.revokeObjectURL(config.url)
      }

      config.url = audioURL
      return { ...config }
    })
  }, [audioURL])

  return { deviceOptions, audioElapsedTime, audioMax, audioCurrent, isMicReady, isPlaying, isRecording, handleMicChange, handleAudioPlay, handleRecording, handleSeek }
}