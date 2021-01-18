import { useState, useEffect } from 'react'

export default function useResizeDetector(ref) {
  const [hasResize, setHasResize] = useState()

  useEffect(() => {
    const resizeObserver = new ResizeObserver(e => {
      setHasResize({ width: e[0].contentRect.width, height: e[0].contentRect.height })
    })
    resizeObserver.observe(ref.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  return { hasResize }
}