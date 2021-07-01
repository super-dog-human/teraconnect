import { useState } from 'react'
import useSynthesisVoice from '../../useSynthesisVoice'
import useAudioPlayer from '../../useAudioPlayer'
import { useRouter } from 'next/router'

export default function useSynthesisVoiceEditor(config, dispatchConfig) {
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const router = useRouter()
  const { createSynthesisVoiceFile } = useSynthesisVoice()
  const { isPlaying, createAudio, switchAudio } = useAudioPlayer()

  function setSubtitle(e) {
    dispatchConfig({ type: 'synthesisSubtitle', payload: e.target.value })
  }

  function setLanguageCode(languageCode, voiceName) {
    dispatchConfig({ type: 'initializeSynthesis', payload: { languageCode, name: voiceName } })
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

  return { setSubtitle, setLanguageCode, setName, setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isSynthesizing }
}