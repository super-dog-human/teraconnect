import { useRef, useState, useEffect } from 'react'
import { floatSecondsToMinutesFormat } from '../utils'

export default function useAudioPlayer() {
  const audioRef = useRef()
  const durationTime = useRef('')
  const [audioDuration, setAudioDuration] = useState(0)
  const [audioCurrent, setAudioCurrent] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElapsedTime, setAudioElapasedTime] = useState('')

  function createAudio(voiceURL) {
    const audio = new Audio(voiceURL)
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
    setAudioDuration(Math.floor(audioRef.current.duration * 100) / 100) // rangeのmaxで使用するがstepによっては最後までシークが届かず再生終了するので切り捨てる
    durationTime.current = floatSecondsToMinutesFormat(audioRef.current.duration)

    setIsPlaying(true)
    updateAudioElapsedtime()
  }

  function stop() {
    audioRef.current.pause()
    setIsPlaying(false)
  }

  function updateAudioElapsedtime() {
    setAudioCurrent(audioRef.current.currentTime)
    const time = floatSecondsToMinutesFormat(audioRef.current.currentTime) + ' / ' + durationTime.current
    setAudioElapasedTime(time)

    if (isStopped()) return
    requestAnimationFrame(updateAudioElapsedtime)
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

  return { isPlaying, createAudio, switchAudio, seekAudio, audioRef, audioElapsedTime, audioDuration, audioCurrent }
}