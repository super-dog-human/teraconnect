import { useState, useEffect } from 'react'

export default function useChangeTabDetector() {
  const [isActive, setIsActive] = useState(true)

  function handleVisibilityChange() {
    setIsActive(!document.hidden)
  }

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return isActive
}