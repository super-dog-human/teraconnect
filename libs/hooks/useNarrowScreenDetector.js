import { useState, useEffect } from 'react'
import { useScreenClass } from 'react-grid-system'

export default function useNarrowScreenDetector() {
  const screenClass = useScreenClass()
  const [isNarrowScreen, setIsNarrowScreen] = useState(false)

  useEffect(() => {
    setIsNarrowScreen(['xs', 'sm', 'md'].includes(screenClass))
  }, [screenClass])

  return isNarrowScreen
}