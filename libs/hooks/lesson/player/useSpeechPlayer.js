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

  const playSpeech = useCallback(async() => {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
      audioRef.current.currentTime = 0
    }

    setIsPlaying(true)
    await audioRef.current.play()
  }, [durationSec])

  const stopSpeech = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause()
    }
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
    audioRef.current = new Audio(url)
    audioRef.current.preload = 'auto'
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

  const seekSpeech = useCallback(e => {
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
  }, [isPlaying, stopSpeech, playSpeech])

  useEffect(() => {
    if (!url) return
    if (audioRef.current === undefined || audioRef.current.src !== url) {
      createAudio()
    }
  }, [url, createAudio])

  useEffect(() => {
    if (url) return
    // 別の授業に遷移時、urlがクリアされるタイミングで現在の音声を停止し、経過時間をリセット
    stopSpeech()
    elapsedTimeRef.current = 0
  }, [url, stopSpeech])

  return { isLoading, isPlaying, playSpeech, stopSpeech, updateSpeeche, seekSpeech }
}