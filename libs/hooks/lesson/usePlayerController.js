import { useEffect, useRef, useState } from 'react'
import { Clock } from 'three'

export default function usePlayerController() {
  const clockRef = useRef()
  const [isPlayerHover, setIsPlayerHover] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerElapsedTime, setPlayerElapsedTime] = useState(0)

  function handleMouseOver() {
    setIsPlayerHover(true)
  }

  function handleMouseLeave() {
    setIsPlayerHover(false)
  }

  function handlePlayButtonClick() {
    setIsPlaying(p => !p)
  }

  function handleDragStart(e) {
    e.preventDefault() // 行ドラッグになってしまうのを防ぐ
    e.stopPropagation()
  }

  function deltaTime() {
    return clockRef.current.getDelta()
  }

  function resetClock() {
    clockRef.current = new Clock(false)
  }

  function switchClock(start) {
    if (start) {
      clockRef.current.start()
    } else {
      clockRef.current.stop()
    }
  }

  useEffect(() => {
    resetClock()
  }, [])

  return { isPlayerHover, isPlaying, setIsPlaying, playerElapsedTime, setPlayerElapsedTime,
    deltaTime, resetClock, switchClock, handleMouseOver, handleMouseLeave, handlePlayButtonClick, handleDragStart }
}