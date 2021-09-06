import { useEffect, useRef, useState } from 'react'
import { Clock } from 'three'

export default function usePlayerController() {
  const clockRef = useRef()
  const [isPlaying, setIsPlaying] = useState(false)
  const [playerElapsedTime, setPlayerElapsedTime] = useState(0)

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

  return { isPlaying, setIsPlaying, playerElapsedTime, setPlayerElapsedTime, deltaTime, resetClock, switchClock }
}