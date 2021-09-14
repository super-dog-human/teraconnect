import { useState, useRef, useCallback, useEffect } from 'react'
import { useUnmount } from 'react-use'

export default function useSpeechPlayer({ url, durationSec } ) {
  const audioRef = useRef()
  const elapsedTimeRef = useRef(0)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  useUnmount(() => {
    if (isPlaying) stopSpeech()
  })


  async function playSpeech() {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
      audioRef.current.currentTime = 0
    }

    setIsPlaying(true)
    await audioRef.current.play()
  }

  const stopSpeech = useCallback(() => {
    audioRef.current.pause()
    setIsPlaying(false)
  }, [])

  function updateSpeeche(incrementalTime) {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime

    if (newElapsedTime < durationSec) {
      elapsedTimeRef.current = newElapsedTime
    } else {
      stopSpeech()
      elapsedTimeRef.current = durationSec
    }
  }

  const createAudio = useCallback(() => {
    audioRef.current = new Audio(url + '?' + Date.now())
    audioRef.current.onwaiting = () => {
      setIsLoading(true)
      setIsPlaying(false)
    }
    audioRef.current.oncanplaythrough = () => {
      setIsLoading(false)
      if (!audioRef.current.paused) setIsPlaying(true)
    }
    audioRef.current.load() // モバイル環境用
  }, [url])

  function seekSpeech(e) {
    let shouldResume = false
    if (isPlaying) {
      stopSpeech()
      shouldResume = true
    }

    elapsedTimeRef.current = parseFloat(e.target.value)
    audioRef.current.currentTime = elapsedTimeRef.current

    if (shouldResume) {
      playSpeech()
    }
  }

  useEffect(() => {
    if (audioRef.current === undefined || audioRef.current.src !== url) {
      createAudio()
    }
  }, [url, createAudio])

  return { isLoading, isPlaying, playSpeech, stopSpeech, updateSpeeche, seekSpeech }
}