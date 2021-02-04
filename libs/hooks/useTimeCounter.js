import { useState, useEffect } from 'react'
import * as THREE from 'three'

let clock
let realTime = 0
let isStart = false

export default function useTimeCounter() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  function animate() {
    if (isStart) {
      requestAnimationFrame(animate)
    }

    realTime += clock.getDelta()
    if (realTime - elapsedSeconds > 1.0) {
      setElapsedSeconds(Math.floor(realTime))
    }
  }

  function switchCounter(status) {
    isStart = status
    if (isStart) {
      clock.start()
      animate()
    } else {
      clock.stop()
    }
  }

  function realElapsedTime() {
    return realTime
  }

  useEffect(() => {
    clock = new THREE.Clock()
  }, [])

  return { elapsedSeconds, realElapsedTime, switchCounter }
}