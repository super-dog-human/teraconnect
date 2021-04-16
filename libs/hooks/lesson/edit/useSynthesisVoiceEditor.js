import { useState } from 'react'
import useSynthesisVoice from '../../useSynthesisVoice'
import useAudioPlayer from '../../useAudioPlayer'
import { useRouter } from 'next/router'
import { SYNTHESIS_VOICE_LANGUAGE_NAMES, SYNTHESIS_JAPANESE_VOICE_NAMES, SYNTHESIS_ENGLISH_VOICE_NAMES } from '../../../constants'

export default function useSynthesisVoiceEditor(config, setConfig) {
  const [voiceNames, setVoiceNames] = useState(SYNTHESIS_JAPANESE_VOICE_NAMES)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
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
    let newVoiceName // 言語を変更した際、声も選択肢の最初のものにリセットする
    if (languageCode === SYNTHESIS_VOICE_LANGUAGE_NAMES[0].value) {
      setVoiceNames(SYNTHESIS_JAPANESE_VOICE_NAMES)
      newVoiceName = SYNTHESIS_JAPANESE_VOICE_NAMES[0].value
    } else {
      setVoiceNames(SYNTHESIS_ENGLISH_VOICE_NAMES)
      newVoiceName = SYNTHESIS_ENGLISH_VOICE_NAMES[0].value
    }

    setConfig(config => {
      config.synthesisConfig.languageCode = languageCode
      config.synthesisConfig.name = newVoiceName
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
      setIsSynthesizing(true)

      const lessonID = parseInt(router.query.id)
      const voice = await createSynthesisVoiceFile(lessonID, config)
      setConfig(config => {
        config.voiceID = voice.id
        config.url = voice.url
        return { ...config }
      })
      createAudio(voice.url)

      setIsSynthesizing(false)
    }

    switchAudio()
  }

  return { languageNames: SYNTHESIS_VOICE_LANGUAGE_NAMES, voiceNames, setSubtitle, setLanguageCode, setName,
    setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isSynthesizing }
}