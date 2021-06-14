import { useCallback, useEffect } from 'react'

export default function usePreventUnload(isPreventUnload) {
  const handleBeforeunload = useCallback(e => {
    e.preventDefault()
    e.returnValue = ''
  }, [])

  function disableUnload() {
    window.addEventListener('beforeunload', handleBeforeunload)
  }

  function enableUnload() {
    window.removeEventListener('beforeunload', handleBeforeunload)
  }

  useEffect(() => {
    return () => {
      enableUnload()
    }
  }, [])

  useEffect(() => {
    if (isPreventUnload) {
      disableUnload()
    } else {
      enableUnload()
    }
  }, [isPreventUnload])
}