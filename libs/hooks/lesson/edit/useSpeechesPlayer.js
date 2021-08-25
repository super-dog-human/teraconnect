import { useRef, useState, useCallback, useEffect } from 'react'
import { voiceURL } from '../../../speechUtils'

export default function useSpeechesPlayer({ lessonID, durationSec, speeches }) {
  const elapsedTimeRef = useRef(0)
  const shouldResumeRef = useRef(false)
  const [didUpdatedSpeeches, setDidUpdatedSpeeches] = useState(false)
  const [voices, setVoices] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const stopSpeeches = useCallback(excludeAudio => {
    setIsPlaying(false)
    voices.forEach(v => {
      if (v.audio.paused) return
      if (v.audio === excludeAudio) return
      v.audio.pause()
    })
  }, [voices])

  const createAudio = useCallback(voiceURL => {
    const audio = new Audio(voiceURL)
    audio.onwaiting = () => {
      let existsPreparingSpeech = false
      setVoices(voices => {
        const voice = voices.find(v => v.audio === audio)
        if (!voice || !voice.canPlay) return voices
        if (!voice.audio.paused) {
          existsPreparingSpeech = true
        }
        voice.canPlay = false
        return [...voices]
      })
      if (isPlaying && existsPreparingSpeech) {
        shouldResumeRef.current = true
        stopSpeeches(audio) // 自身は自動で再開されるので停止しない
        setIsLoading(true)
      }
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
    audio.onended = () => {
      setVoices(speeches => speeches.filter(s => s.audio !== audio))
    }
    return audio
  }, [isPlaying, stopSpeeches])

  const addNewVoice = useCallback(voice => {
    let addedNewVoice = false
    setVoices(voices => {
      if (voices.find(s => s.id === voice.voiceID)) {
        return voices
      }

      addedNewVoice = true
      const url = voiceURL(lessonID, voice.voiceID, voice.voiceFileKey)
      voices.push({
        id: voice.voiceID,
        audio: createAudio(url),
        canPlay: false,
        elapsedTime: voice.elapsedTime,
        durationSec: voice.durationSec,
      })
      return [...voices]
    })
    return addedNewVoice
  }, [lessonID, setVoices, createAudio])

  const prefetchVoice = useCallback(() => {
    let addedNewVoice = false
    const targets = speeches.filter(s => s.voiceID && s.elapsedTime <= elapsedTimeRef.current + 60.0 && s.elapsedTime + s.durationSec > elapsedTimeRef.current)
    for (let i = 0; i < targets.length; i++) {
      if (addNewVoice(targets[i])) addedNewVoice = true
    }
    return addedNewVoice
  }, [speeches, addNewVoice])

  const setVoicesTime = useCallback(async needsPlay => {
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
    }
    setIsPlaying(true)
    setVoicesTime(true)
  }, [durationSec, setVoicesTime])

  async function updateSpeeches(incrementalTime) {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime

    if (newElapsedTime < durationSec) {
      const shouldPrefetch = Math.floor(newElapsedTime) - Math.floor(elapsedTimeRef.current) > 0
      elapsedTimeRef.current = newElapsedTime
      if (shouldPrefetch) prefetchVoice()
      await setVoicesTime(true)
    } else {
      stopSpeeches()
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
    const addedNewVoice = prefetchVoice()
    setVoicesTime(false)
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
    prefetchVoice()
    setIsLoading(false)

    if (didPlaying) playSpeeches()
  }, [isPlaying, stopSpeeches, prefetchVoice, playSpeeches])

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