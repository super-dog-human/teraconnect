import { useRef, useState, useEffect } from 'react'

export default function useDebounce(value, delay) {
  const timerRef = useRef()
  const [debouncedValue, setDebouncedValue] = useState(value)

  function manuallyClear() {
    clearTimeout(timerRef.current)
  }

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(timerRef.current)
    }

  }, [value, delay])

  return { debouncedValue, manuallyClear }
}
