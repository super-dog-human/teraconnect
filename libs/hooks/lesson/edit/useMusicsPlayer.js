import { useRef, useState, useCallback, useEffect } from 'react'
import { useUnmount } from 'react-use'

const fadingDuration = 4

export default function useMusicsPlayer({ durationSec, musics: originalMusics, musicURLs }) {
  const elapsedTimeRef = useRef(0)
  const shouldResumeRef = useRef(false)
  const [didUpdatedMusics, setDidUpdatedMusics] = useState(false)
  const [musics, setMusics] = useState([])
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  useUnmount(() => {
    if (isPlaying) stopMusics()
  })

  const stopMusics = useCallback(() => {
    setIsPlaying(false)
    musics.forEach(v => {
      if (v.audio.paused) return
      v.audio.pause()
    })
  }, [musics])

  const createAudio = useCallback((musicURL, isLoop) => {
    const audio = new Audio()
    audio.onwaiting = () => {
      setMusics(musics => {
        const music = musics.find(v => v.audio === audio)
        if (!music || !music.canPlay) return musics
        music.canPlay = false
        return [...musics]
      })
    }
    audio.oncanplaythrough = () => {
      setMusics(musics => {
        const music = musics.find(v => v.audio === audio)
        if (!music || music.canPlay) return musics
        music.canPlay = true
        return [...musics]
      })
    }
    audio.onerror = () => {
      console.error(audio.error)
      setMusics(musics => {
        const music = musics.find(v => v.audio === audio)
        if (!music || music.canPlay) return musics
        // 連続したシークなどでバッファが枯渇するときにエラーが起きる模様。
        // このままではローディングが解除されないなどの不具合を引き起こすので便宜上 canPlay: true にする
        music.canPlay = true
        return [...musics]
      })
    }
    audio.loop = isLoop
    audio.src = musicURL
    return audio
  }, [])

  const setMusicVolume = useCallback(music => {
    const timeSinceStart = elapsedTimeRef.current - music.elapsedTime
    const timeUntilEnd = music.elapsedTime + music.durationSec - elapsedTimeRef.current
    if (music.isFadeIn) {
      if (0 <= timeSinceStart && timeSinceStart < fadingDuration) {
        music.audio.volume = timeSinceStart / fadingDuration * music.maxVolume
      } else if (fadingDuration <= timeUntilEnd && music.audio.volume < 1) {
        music.audio.volume = music.maxVolume
      }
    }
    if (music.isFadeOut) {
      if (0 < timeUntilEnd && timeUntilEnd < fadingDuration) {
        music.audio.volume = timeUntilEnd / fadingDuration * music.maxVolume
      } else if (timeUntilEnd <= 0 && music.audio.volume > 0) {
        music.audio.volume = 0
      }
    }
  }, [])

  const setMusicTimes = useCallback(async needsPlay => {
    let latestMusics = []
    setMusics(musics => {
      latestMusics = musics // requestAnimationFrame経由で呼ばれた場合、最新のstateが取得できないのでsetState中で取得する
      return musics
    })

    const newMusics = []
    latestMusics.forEach(music => {
      if (music.elapsedTime > elapsedTimeRef.current) return                // まだ再生すべきでない
      if (music.elapsedTime + music.durationSec < elapsedTimeRef.current) { // すでに再生期間が終わっている
        if (!music.audio.paused) music.audio.pause()
        return
      }
      if (!music.audio.paused) {                                            // ボリュームのフェード
        if (music.isFadeIn || music.isFadeOut) setMusicVolume(music)
        return
      }
      newMusics.push(music)                                                 // 今から再生すべき
    })

    if (needsPlay && newMusics.some(v => !v.canPlay)) {
      shouldResumeRef.current = true
      stopMusics()
      setIsLoading(true)
      return
    }

    for (let i = 0; i < newMusics.length; i++) {
      const music = newMusics[i]
      const currentTime = elapsedTimeRef.current - music.elapsedTime
      if (music.isLoop && currentTime > music.audio.duration) {
        music.audio.currentTime = currentTime % music.audio.duration
      } else {
        music.audio.currentTime = currentTime
      }
      if (music.isFadeIn) music.audio.volume = 0
      if (needsPlay) await music.audio.play()
    }
  }, [stopMusics, setMusicVolume])

  const playMusics = useCallback(() => {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
    }
    setIsPlaying(true)
    setMusicTimes(true)
  }, [durationSec, setMusicTimes])

  async function updateMusics(incrementalTime) {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime

    if (newElapsedTime < durationSec) {
      elapsedTimeRef.current = newElapsedTime
      await setMusicTimes(true)
    } else {
      stopMusics()
      elapsedTimeRef.current = durationSec
    }
  }

  async function seekMusics(e) {
    const didPlaying = isPlaying
    if (isPlaying) {
      shouldResumeRef.current = true
      stopMusics()
      setIsLoading(true)
    }

    elapsedTimeRef.current = parseFloat(e.target.value)
    setMusicTimes(false)
    if (didPlaying) {
      setIsLoading(false)
      shouldResumeRef.current = false
      playMusics()
    }
  }

  const replaceMusics = useCallback(() => {
    const newMusics = []
    originalMusics.forEach((music, i) => {
      if (music.action === 'stop') return
      const url = musicURLs[music.backgroundMusicID]?.url
      if (!url) return

      const nextMusic = originalMusics[i + 1]
      const nextElapsedTime = nextMusic ? nextMusic.elapsedTime : durationSec
      newMusics.push({
        audio: createAudio(url, music.isLoop),
        canPlay: false,
        isLoop: music.isLoop,
        isFadeIn: music.isFading,
        isFadeOut: nextMusic?.action === 'stop' && nextMusic?.isFading,
        maxVolume: music.volume,
        elapsedTime: music.elapsedTime,
        durationSec: nextElapsedTime - music.elapsedTime,
      })
    })
    setMusics(newMusics)
  }, [originalMusics, musicURLs, durationSec, createAudio])

  const refreshMusics = useCallback(() => {
    const didPlaying = isPlaying
    if (isPlaying) stopMusics()

    setIsLoading(true)
    replaceMusics()
    setIsLoading(false)

    if (didPlaying) playMusics()
  }, [isPlaying, stopMusics, replaceMusics, playMusics])

  useEffect(() => {
    if (musics.every(s => s.canPlay)) {
      setIsLoading(false)
      if (shouldResumeRef.current) {
        shouldResumeRef.current = false
        playMusics()
      }
    }
  }, [musics, playMusics])

  useEffect(() => {
    setDidUpdatedMusics(true)
  }, [originalMusics, musicURLs, durationSec]) // durationSecは停止行のない最後のBGMの再生時間計算に使用されるため、依存配列に必要

  useEffect(() => {
    if (!didUpdatedMusics) return
    if (musicURLs.length === 0) return
    refreshMusics()
    setDidUpdatedMusics(false)
  }, [didUpdatedMusics, musicURLs, refreshMusics])

  return { isLoading, isPlaying, playMusics, stopMusics, updateMusics, seekMusics }
}