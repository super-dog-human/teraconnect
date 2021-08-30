import { useState, useEffect } from 'react'

export default function useMobileDetector() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.ontouchstart !== undefined)
  }, [])

  return isMobile
}