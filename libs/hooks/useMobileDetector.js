import { useState, useEffect } from 'react'
import { useScreenClass } from 'react-grid-system'

export default function useMobileDetector() {
  const screenClass = useScreenClass()
  const [isMobile, setIsMobile] = useState() // 未判定の場合を区別するため初期値を空にする

  useEffect(() => {
    setIsMobile(['xs', 'sm'].includes(screenClass))
  }, [screenClass])

  return isMobile
}