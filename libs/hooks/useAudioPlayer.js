import { useRef, useState } from 'react'

export default function useAudioPlayer() {
  const audioRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)

  function createAudio(voiceURL) {
    const audio = new Audio(voiceURL)
    audio.onended = () => setIsPlaying(false)
    audioRef.current = audio
  }

  function switchAudio() {
    if (audioRef.current.paused || audioRef.current.ended) {
      audioRef.current.play()
      setIsPlaying(true)
    } else {
      audioRef.current.pause()
      setIsPlaying(false)
    }
  }

  return { isPlaying, createAudio, switchAudio, audioRef }
}