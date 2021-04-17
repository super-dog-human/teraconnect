import { useRef, useState, useEffect } from 'react'
import { floatSecondsToMinutesFormat } from '../utils'

export default function useAudioPlayer() {
  const audioRef = useRef()
  const durationDisplayTime = useRef('')
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioCurrent, setAudioCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElapsedTime, setAudioElapasedTime] = useState('')

  function createAudio(voiceURL, onloadedCallback) {
    const audio = new Audio(voiceURL)
    audio.onloadedmetadata = () => {
      if (onloadedCallback) onloadedCallback(audio)
      setAudioDuration(parseFloat(audio.duration.toFixed(3)))
      durationDisplayTime.current = floatSecondsToMinutesFormat(audio.duration)
    }
    audio.onended = () => {
      updateAudioElapsedtime() // タイミングによっては表示秒数が不足したまま再生終了になるので最後に更新する
      stop()
    }
    audioRef.current = audio
  }

  function switchAudio() {
    if (isStopped()) {
      play()
    } else {
      stop()
    }
  }

  function isStopped() {
    if (!audioRef.current) return true
    return audioRef.current.paused || audioRef.current.ended
  }

  function play() {
    audioRef.current.play()
    setIsPlaying(true)
    updateAudioTimes()
  }

  function stop() {
    audioRef.current.pause()
    setIsPlaying(false)
  }

  function updateAudioTimes() {
    setAudioCurrent(audioRef.current.currentTime) // シークバーの●を動かすのに使用される
    updateAudioElapsedtime()

    if (isStopped()) return
    requestAnimationFrame(updateAudioTimes)
  }

  function updateAudioElapsedtime() {
    const time = floatSecondsToMinutesFormat(audioRef.current.currentTime) + ' / ' + durationDisplayTime.current
    setAudioElapasedTime(time)
  }

  function seekAudio(toSeconds) {
    audioRef.current.currentTime = toSeconds
    updateAudioElapsedtime()
  }

  useEffect(() => {
    return () => {
      if (isStopped()) return
      stop()
    }
  }, [])

  return { isPlaying, createAudio, switchAudio, seekAudio, audioElapsedTime, audioDuration, audioCurrent }
}