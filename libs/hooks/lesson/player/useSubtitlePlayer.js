import { useState, useRef, useCallback, useEffect } from 'react'

export default function useSubtitlePlayer({ startElapsedTime, durationSec, speeches }) {
  const [subtitle, setSubtitle] = useState()
  const elapsedTimeRef = useRef(startElapsedTime)

  function initializeSubtitle() {
    if (elapsedTimeRef.current >= startElapsedTime + durationSec) {
      elapsedTimeRef.current = startElapsedTime
    }
  }

  const updateSubtitle = useCallback(incrementalTime => {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime
    const speech = speeches.slice().reverse().find(s => s.elapsedTime <= newElapsedTime && s.elapsedTime + s.durationSec >= newElapsedTime)
    if (speech) {
      setSubtitle({ body: speech.subtitle, caption: speech.caption })
    } else {
      setSubtitle()
    }

    if (newElapsedTime < startElapsedTime + durationSec) {
      elapsedTimeRef.current = newElapsedTime
    } else {
      elapsedTimeRef.current = startElapsedTime + durationSec
      return
    }
  }, [speeches, durationSec, startElapsedTime])

  function seekSubtitle(e) {
    elapsedTimeRef.current = startElapsedTime + parseFloat(e.target.value)
    updateSubtitle(0)
  }

  useEffect(() => {
    if (!speeches || speeches.length === 0) return
    updateSubtitle(0)
  }, [speeches, updateSubtitle])

  return { subtitle, initializeSubtitle, updateSubtitle, seekSubtitle }
}