import { useRef, useState, useEffect } from 'react'
import useAudioPlayer from '../../useAudioPlayer'

export default function useHumanVoicePlayer(config) {
  const audioURLRef = useRef('')
  const [audioMax, setAudioMax] = useState(0)
  const { isPlaying, createAudio, switchAudio, seekAudio, audioElapsedTime, audioDuration, audioCurrent } = useAudioPlayer()

  function handlePlay() {
    switchAudio()
  }

  function handleSeek(e) {
    seekAudio(e.target.value)
  }

  useEffect(() => {
    if (audioURLRef.current === config.url) return

    createAudio(config.url)
    audioURLRef.current = config.url
  }, [config])

  useEffect(() => {
    // audioMaxはrangeのmaxに使用されるが、stepが0.1だと四捨五入した値で最後までシークバーの●が届かない場合があるので切り捨てる
    setAudioMax(Math.floor(audioDuration * 10) / 10)
  }, [audioDuration])

  return { audioElapsedTime, audioMax, audioCurrent, isPlaying, handlePlay, handleSeek }
}