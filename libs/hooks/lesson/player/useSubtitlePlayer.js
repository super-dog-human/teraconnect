import { useState, useCallback, useEffect } from 'react'

export default function useSubtitlePlayer({ elapsedTimeRef, speeches }) {
  const [subtitle, setSubtitle] = useState()

  const updateSubtitle = useCallback(() => {
    const speech = speeches.slice().reverse().find(s => s.elapsedTime <= elapsedTimeRef.current && s.elapsedTime + s.durationSec >= elapsedTimeRef.current)
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
  }, [elapsedTimeRef, speeches])

  function shouldUpdateState(subtitle, newSubtitle) {
    if (!subtitle) return true
    if (subtitle.body !== newSubtitle.body) return true
    return Object.keys(newSubtitle.caption).some(key => {
      return newSubtitle.caption[key] !== subtitle.caption[key]
    })
  }

  function seekSubtitle() {
    updateSubtitle(0)
  }

  useEffect(() => {
    if (!speeches || speeches.length === 0) return
    updateSubtitle(0)
  }, [speeches, updateSubtitle])

  return { subtitle, updateSubtitle, seekSubtitle }
}