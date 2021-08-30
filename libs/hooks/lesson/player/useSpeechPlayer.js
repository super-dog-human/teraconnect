import { useState, useRef, useCallback, useEffect } from 'react'

export default function useSpeechPlayer({ url, durationSec } ) {
  const audioRef = useRef()
  const elapsedTimeRef = useRef(0)
  const [isPreparing, setIsPreparing] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)

  async function startPlaying() {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
      audioRef.current.currentTime = 0
    }

    setIsPlaying(true)
    await audioRef.current.play()
  }

  const stopPlaying = useCallback(() => {
    setIsPlaying(false)
    audioRef.current.pause()
  }, [])

  function updateSpeeche(incrementalTime) {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime

    if (newElapsedTime < durationSec) {
      elapsedTimeRef.current = newElapsedTime
    } else {
      stopPlaying()
      elapsedTimeRef.current = durationSec
    }
  }

  const createAudio = useCallback(() => {
    audioRef.current = new Audio(url)
    audioRef.current.onwaiting = () => {
      setIsPreparing(true)
      setIsPlaying(false)
    }
    audioRef.current.oncanplaythrough = () => {
      setIsPreparing(false)
      if (!audioRef.current.paused) setIsPlaying(true)
    }
  }, [url])

  function handleSeekChange(e) {
    let shouldResume = false
    if (isPlaying) {
      stopPlaying()
      shouldResume = true
    }

    elapsedTimeRef.current = parseFloat(e.target.value)
    audioRef.current.currentTime = elapsedTimeRef.current

    if (shouldResume) {
      startPlaying()
    }
  }

  useEffect(() => {
    if (audioRef.current === undefined || audioRef.current.src !== url) {
      createAudio()
    }
  }, [url, createAudio])

  return { isPreparing, isPlaying, startPlaying, stopPlaying, updateSpeeche, handleSeekChange }
}