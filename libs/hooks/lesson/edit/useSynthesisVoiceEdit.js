import { useState } from 'react'
import useSynthesisVoice from './useSynthesisVoice'
import useAudioPlayer from '../../useAudioPlayer'
import { useRouter } from 'next/router'

export default function useSynthesisVoiceEdit(config, setConfig) {
  const languageNames = [
    { value: 'ja-JP', label: '日本語' },
    { value: 'en-US', label: '英語' },
  ]

  const japaneseVoiceNames = [
    { value: 'ja-JP-Wavenet-A', label: 'タイプA' },
    { value: 'ja-JP-Wavenet-B', label: 'タイプB' },
    { value: 'ja-JP-Wavenet-C', label: 'タイプC' },
    { value: 'ja-JP-Wavenet-D', label: 'タイプD' },
  ]

  const englishVoiceNames = [
    { value: 'en-US-Wavenet-A', label: 'タイプA' },
    { value: 'en-US-Wavenet-B', label: 'タイプB' },
    { value: 'en-US-Wavenet-C', label: 'タイプC' },
    { value: 'en-US-Wavenet-D', label: 'タイプD' },
    { value: 'en-US-Wavenet-E', label: 'タイプE' },
    { value: 'en-US-Wavenet-F', label: 'タイプF' },
    { value: 'en-US-Wavenet-G', label: 'タイプG' },
    { value: 'en-US-Wavenet-H', label: 'タイプH' },
    { value: 'en-US-Wavenet-I', label: 'タイプI' },
    { value: 'en-US-Wavenet-J', label: 'タイプJ' },
  ]

  const [voiceNames, setVoiceNames] = useState(japaneseVoiceNames)
  const [isSynthesing, setIsSynthesing] = useState(false)
  const router = useRouter()
  const { createSynthesisVoiceFile } = useSynthesisVoice()
  const { isPlaying, createAudio, switchAudio } = useAudioPlayer()


  function setSubtitle(e) {
    setConfig(config => {
      config.subtitle = e.target.value
      config.url = ''
      return { ...config }
    })
  }

  function setLanguageCode(e) {
    const languageCode = e.target.value

    if (languageCode === languageNames[0].value) {
      setVoiceNames(japaneseVoiceNames)
    } else {
      setVoiceNames(englishVoiceNames)
    }

    setConfig(config => {
      config.synthesisConfig.languageCode = languageCode
      config.url = ''
      return { ...config }
    })
  }

  function setName(e) {
    setConfig(config => {
      config.synthesisConfig.name = e.target.value
      config.url = ''
      return { ...config }
    })
  }

  function setSpeakingRate(e) {
    setConfig(config => {
      config.synthesisConfig.speakingRate = e.target.value
      config.url = ''
      return { ...config }
    })
  }

  function setPitch(e) {
    setConfig(config => {
      config.synthesisConfig.pitch = e.target.value
      config.url = ''
      return { ...config }
    })
  }

  function setVolumeGainDb(e) {
    setConfig(config => {
      config.synthesisConfig.volumeGainDb = e.target.value
      config.url = ''
      return { ...config }
    })
  }

  async function playVoice() {
    if (isPlaying) {
      switchAudio()
      return
    }

    if (config.url) {
      createAudio(config.url)
    } else {
      setIsSynthesing(true)

      const lessonID = parseInt(router.query.id)
      const voice = await createSynthesisVoiceFile(lessonID, config)
      setConfig(config => {
        config.voiceID = voice.id
        config.url = voice.url
        return { ...config }
      })
      createAudio(voice.url)

      setIsSynthesing(false)
    }

    switchAudio()
  }

  return { languageNames, voiceNames, setSubtitle, setLanguageCode, setName, setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isSynthesing }
}