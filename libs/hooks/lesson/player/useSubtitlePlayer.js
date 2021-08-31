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
      setSubtitle(subtitle => {
        const newSubtite = { body: speech.subtitle, caption: speech.caption }
        if (shouldUpdateState(subtitle, newSubtite)) {
          return newSubtite
        } else {
          return subtitle
        }
      })
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

  function shouldUpdateState(subtitle, newSubtitle) {
    if (!subtitle) return true
    if (subtitle.body !== newSubtitle.body) return true
    return Object.keys(newSubtitle.caption).some(key => {
      return newSubtitle.caption[key] !== subtitle.caption[key]
    })
  }

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