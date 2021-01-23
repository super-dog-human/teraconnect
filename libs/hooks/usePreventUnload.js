import { useEffect } from 'react'

export default function usePreventUnload() {
  useEffect(() => {
    function handleBeforeunload(e) {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeunload)

    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload)
    }
  }, [])
}