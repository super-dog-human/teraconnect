import { useRef, useEffect } from 'react'

export default function useUnmountRef() {
  const unmountRef = useRef(false)

  useEffect(() => {
    return () => {
      unmountRef.current = true
    }
  }, [])

  return unmountRef
}