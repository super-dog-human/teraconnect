import { useRef, useState } from 'react'
import useSynthesisVoice from '../useSynthesisVoice'
import useAudioPlayer from '../useAudioPlayer'
import { useRouter } from 'next/router'
import { voiceURL } from '../../speechUtils'

export default function useSynthesisVoiceEditor({ dispatchConfig, url, subtitle, synthesisConfig, defaultSynthesisConfig }) {
  const [isSynthesizing, setIsSynthesizing] = useState(false)
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const { createSynthesisVoiceFile } = useSynthesisVoice(defaultSynthesisConfig)
  const { isPlaying, createAudio, switchAudio } = useAudioPlayer()

  function setSubtitle(e) {
    dispatchConfig({ type: 'synthesisSubtitle', payload: e.target.value })
  }

  function setLanguageCode(languageCode, voiceName) {
    dispatchConfig({ type: 'synthesisLanguageAndName', payload: { languageCode, name: voiceName } })
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

    if (url) {
      createAudio(url)
    } else {
      setIsSynthesizing(true)

      const voice = await createSynthesisVoiceFile({ lessonID: lessonIDRef.current, subtitle, synthesisConfig })
      const url = voiceURL(lessonIDRef.current, voice.id, voice.fileKey)
      dispatchConfig({ type: 'synthesisVoice', payload: { voiceID: voice.id, voiceFileKey: voice.fileKey, url } })
      createAudio(url)

      setIsSynthesizing(false)
    }

    switchAudio()
  }

  return { setSubtitle, setLanguageCode, setName, setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isSynthesizing }
}