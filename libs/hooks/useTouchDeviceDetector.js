import { useState, useEffect } from 'react'

export default function useTouchDeviceDetector() {
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice(window.ontouchstart !== undefined)
  }, [])

  return isTouchDevice
}