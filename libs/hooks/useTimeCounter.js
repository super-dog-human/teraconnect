import { useRef, useState, useCallback, useEffect } from 'react'
import * as THREE from 'three'

export default function useTimeCounter() {
  const clockRef = useRef()
  const realTimeRef = useRef(0)
  const isStartRef = useRef(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  function animate() {
    if (isStartRef.current) {
      requestAnimationFrame(animate)
    }

    realTimeRef.current += clockRef.current.getDelta()
    if (realTimeRef.current - elapsedSeconds > 1.0) {
      setElapsedSeconds(Math.floor(realTimeRef.current))
    }
  }

  function switchCounter(status) {
    isStartRef.current = status
    if (isStartRef.current) {
      clockRef.current.start()
      animate()
    } else {
      clockRef.current.stop()
    }
  }

  const realElapsedTime = useCallback(() => {
    return realTimeRef.current
  }, [])

  useEffect(() => {
    clockRef.current = new THREE.Clock()
  }, [])

  return { elapsedSeconds, realElapsedTime, switchCounter }
}