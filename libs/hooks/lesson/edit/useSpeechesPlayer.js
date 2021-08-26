import { useRef, useState, useCallback, useEffect } from 'react'
import { voiceURL } from '../../../speechUtils'

const prefetchSeconds = 10

export default function useSpeechesPlayer({ lessonID, durationSec, speeches }) {
  const elapsedTimeRef = useRef(0)
  const shouldResumeRef = useRef(false)
  const [didUpdatedSpeeches, setDidUpdatedSpeeches] = useState(false)
  const [voices, setVoices] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const stopSpeeches = useCallback(() => {
    setIsPlaying(false)
    voices.forEach(v => {
      if (v.audio.paused) return
      v.audio.pause()
    })
  }, [voices])

  const createAudio = useCallback(voiceURL => {
    const audio = new Audio()
    audio.onwaiting = () => {
      setVoices(voices => {
        const voice = voices.find(v => v.audio === audio)
        if (!voice || !voice.canPlay) return voices
        voice.canPlay = false
        return [...voices]
      })
    }
    audio.oncanplaythrough = () => {
      setVoices(voices => {
        const voice = voices.find(v => v.audio === audio)
        if (!voice) return voices
        if (voice.canPlay) return voices
        voice.canPlay = true
        return [...voices]
      })
    }
    audio.onerror = () => {
      console.error(audio.error)
      setVoices(voices => {
        const voice = voices.find(v => v.audio === audio)
        if (!voice) return voices
        if (voice.canPlay) return voices
        // 連続したシークなどでバッファが枯渇するときにエラーが起きる模様。
        // このままではローディングが解除されないなどの不具合を引き起こすので便宜上 canPlay: true にする
        voice.canPlay = true
        return [...voices]
      })
    }
    audio.onended = () => {
      setVoices(speeches => speeches.filter(s => s.audio !== audio))
    }
    audio.src = voiceURL
    return audio
  }, [])

  const addNewVoices = useCallback(newSpeeches => {
    let addedNewVoice = false
    setVoices(voices => {
      newSpeeches.forEach(speech => {
        if (voices.find(s => s.id === speech.voiceID)) return

        addedNewVoice = true
        const url = voiceURL(lessonID, speech.voiceID, speech.voiceFileKey)
        voices.push({
          id: speech.voiceID,
          audio: createAudio(url),
          canPlay: false,
          elapsedTime: speech.elapsedTime,
          durationSec: speech.durationSec,
        })
      })
      return addedNewVoice ? [...voices] : voices
    })
    return addedNewVoice
  }, [createAudio, lessonID])

  const prefetchVoices = useCallback(() => {
    let addedNewVoice = false
    const targets = speeches.filter(s => s.voiceID && s.elapsedTime <= elapsedTimeRef.current + prefetchSeconds && s.elapsedTime + s.durationSec > elapsedTimeRef.current)
    if (addNewVoices(targets)) addedNewVoice = true
    return addedNewVoice
  }, [speeches, addNewVoices])

  const setVoiceTimes = useCallback(async needsPlay => {
    let latestVoices = []
    setVoices(voices => {
      latestVoices = voices // requestAnimationFrame経由で呼ばれた場合、最新のstateが取得できないのでsetState中で取得する
      return voices
    })

    const targetVoices = latestVoices.filter(voice => {
      if (voice.elapsedTime + voice.durationSec < elapsedTimeRef.current) return false
      if (voice.elapsedTime > elapsedTimeRef.current) return false
      if (!voice.audio.paused) return false
      return true
    })

    if (needsPlay && targetVoices.some(v => !v.canPlay)) {
      shouldResumeRef.current = true
      stopSpeeches()
      setIsLoading(true)
      return
    }

    for (let i = 0; i < targetVoices.length; i++) {
      const voice = targetVoices[i]
      voice.audio.currentTime = elapsedTimeRef.current - voice.elapsedTime
      if (needsPlay) await voice.audio.play()
    }
  }, [stopSpeeches])

  const playSpeeches = useCallback(() => {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
      prefetchVoices()
    }
    setIsPlaying(true)
    setVoiceTimes(true)
  }, [durationSec, setVoiceTimes, prefetchVoices])

  async function updateSpeeches(incrementalTime) {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime

    if (newElapsedTime < durationSec) {
      const shouldPrefetch = Math.floor(newElapsedTime) - Math.floor(elapsedTimeRef.current) > 0
      elapsedTimeRef.current = newElapsedTime
      if (shouldPrefetch) prefetchVoices()
      await setVoiceTimes(true)
    } else {
      stopSpeeches()
      setVoices([])
      elapsedTimeRef.current = durationSec
    }
  }

  async function seekSpeeches(e) {
    const didPlaying = isPlaying
    if (isPlaying) {
      shouldResumeRef.current = true
      stopSpeeches()
      setIsLoading(true)
    }

    elapsedTimeRef.current = parseFloat(e.target.value)
    setVoices([])
    const addedNewVoice = prefetchVoices()
    setVoiceTimes(false)
    if (didPlaying && !addedNewVoice) {
      setIsLoading(false)
      shouldResumeRef.current = false
      playSpeeches()
    }
  }

  const refreshVoices = useCallback(() => {
    const didPlaying = isPlaying
    if (isPlaying) stopSpeeches()

    setIsLoading(true)
    setVoices([])
    prefetchVoices()
    setIsLoading(false)

    if (didPlaying) playSpeeches()
  }, [isPlaying, stopSpeeches, prefetchVoices, playSpeeches])

  useEffect(() => {
    if (voices.every(s => s.canPlay)) {
      setIsLoading(false)
      if (shouldResumeRef.current) {
        shouldResumeRef.current = false
        playSpeeches()
      }
    }
  }, [voices, playSpeeches])

  useEffect(() => {
    setDidUpdatedSpeeches(true)
  }, [speeches])

  useEffect(() => {
    if (!didUpdatedSpeeches) return
    refreshVoices()
    setDidUpdatedSpeeches(false)
  }, [didUpdatedSpeeches, refreshVoices])

  return { isLoading, isPlaying, playSpeeches, stopSpeeches, updateSpeeches, seekSpeeches }
}