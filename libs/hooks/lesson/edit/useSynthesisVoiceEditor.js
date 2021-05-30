import { useState } from 'react'
import useSynthesisVoice from '../../useSynthesisVoice'
import useAudioPlayer from '../../useAudioPlayer'
import { useRouter } from 'next/router'
import { SYNTHESIS_VOICE_LANGUAGE_NAMES, SYNTHESIS_JAPANESE_VOICE_NAMES, SYNTHESIS_ENGLISH_VOICE_NAMES } from '../../../constants'

export default function useSynthesisVoiceEditor(config, dispatchConfig) {
  const [voiceNames, setVoiceNames] = useState(SYNTHESIS_JAPANESE_VOICE_NAMES)
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const router = useRouter()
  const { createSynthesisVoiceFile } = useSynthesisVoice()
  const { isPlaying, createAudio, switchAudio } = useAudioPlayer()

  function setSubtitle(e) {
    dispatchConfig({ type: 'synthesisSubtitle', payload: e.target.value })
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

    dispatchConfig({ type: 'initializeSynthesis', payload: { languageCode, name: newVoiceName } })
  }

  function setName(e) {
    dispatchConfig({ type: 'synthesisName', payload: e.target.value })
  }

  function setSpeakingRate(e) {
    dispatchConfig({ type: 'synthesisSpeakingRate', payload: e.target.value })
  }

  function setPitch(e) {
    dispatchConfig({ type: 'synthesisPitch', payload: e.target.value })
  }

  function setVolumeGainDb(e) {
    dispatchConfig({ type: 'synthesisVolumeGainDb', payload: e.target.value })
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
      dispatchConfig({ type: 'synthesisVoice', payload: { voiceID: voice.id, url: voice.url } })
      createAudio(voice.url)

      setIsSynthesizing(false)
    }

    switchAudio()
  }

  return { languageNames: SYNTHESIS_VOICE_LANGUAGE_NAMES, voiceNames, setSubtitle, setLanguageCode, setName,
    setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isSynthesizing }
}