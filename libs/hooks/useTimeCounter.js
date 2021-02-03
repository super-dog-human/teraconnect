import { useState, useEffect } from 'react'
import * as THREE from 'three'

let clock
let realElapsedTime = 0
let isStart = false

export default function useTimeCounter() {
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  function switchCounter(status) {
    isStart = status
    if (isStart) {
      clock.start()
      animate()
    } else {
      clock.stop()
    }
  }

  function animate() {
    if (isStart) {
      requestAnimationFrame(animate)
    }

    realElapsedTime += clock.getDelta()
    if (realElapsedTime - elapsedSeconds > 1.0) {
      setElapsedSeconds(Math.floor(realElapsedTime))
    }
  }

  useEffect(() => {
    clock = new THREE.Clock()
  }, [])

  return { elapsedSeconds, switchCounter }
}