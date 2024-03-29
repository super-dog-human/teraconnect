import { useState, useRef, useCallback, useEffect } from 'react'
import { useUnmount } from 'react-use'

export default function useYoutubePlayer({ durationSec, embeddings }) {
  const [youTubes, setYouTubes] = useState([])
  const [youTubeIDs, setYouTubeIDs] = useState([]) // プレーヤーのDOMに使用されるのでなるべく更新しない
  const [isLoading, setIsLoading] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const shouldUpdatePlayerRef = useRef(false)
  const playerRef = useRef({}) // youTubeIDsに変化がなければ使い回し続ける
  const elapsedTimeRef = useRef(0)

  useUnmount(() => {
    if (isPlaying) cleanAllPlayers()
  })

  const currentTimeYouTubes = useCallback(youTubes => {
    return youTubes.filter(youTube => {
      if (elapsedTimeRef.current < youTube.elapsedTime) return false
      if (elapsedTimeRef.current > youTube.elapsedTime + youTube.durationSec) return false
      return true
    })
  }, [])

  function hasReadyPlayer(player) {
    return Object.keys(player.playerInfo).length > 0
  }

  function startMuteVideo(player) {
    player.mute()
    player.playVideo()
  }

  const hideAllPlayers = useCallback(() => {
    Object.values(playerRef.current).forEach(player => {
      if (!hasReadyPlayer(player)) return
      player.getIframe().style.display = 'none'
    })
  }, [])

  const playIfNeeded = useCallback(() => {
    if (elapsedTimeRef.current >= durationSec) {
      elapsedTimeRef.current = 0
      hideAllPlayers()
    }

    setIsPlaying(true)

    currentTimeYouTubes(youTubes).filter(y => !y.isPlaying).forEach(youTube => {
      if (!youTube.canPlay || !youTube.isPlayerReady) {
        setIsLoading(true)
        return
      }

      setYouTubes(youTubes => {
        const target = youTubes.find(y => y === youTube)
        if (!target.isPlaying) {
          target.isPlaying = true
          return [...youTubes]
        } else {
          return youTubes
        }
      })

      const player = playerRef.current[youTube.contentID]
      if (!hasReadyPlayer(player)) return

      player.getIframe().style.display = 'block'
      player.seekTo(elapsedTimeRef.current - youTube.elapsedTime + youTube.startAtSec, true)

      if (player.playerInfo.playerState === window.YT.PlayerState.BUFFERING) {
        setIsLoading(true)
      } else {
        startMuteVideo(player)
      }
    })
  }, [durationSec, youTubes, hideAllPlayers, currentTimeYouTubes])

  const handlePlayerReady = useCallback((e, contentID) => {
    const iframe = e.target.getIframe()
    iframe.style.display = 'none'

    startMuteVideo(e.target) // 再生を開始しないとonStateChangeが実行されないため手動で実施

    setYouTubes(youTubes => {
      youTubes.filter(y => y.contentID === contentID).forEach(y => y.isPlayerReady = true)
      return [...youTubes]
    })
  }, [])

  const handlePlayerStateChange = useCallback((e, contentID) => {
    const canPlay = e.data !== window.YT.PlayerState.BUFFERING
    setYouTubes(youTubes => {
      let hasDiff = false
      youTubes.filter(y => y.contentID === contentID).forEach(y => {
        hasDiff = y.canPlay !== canPlay
        y.canPlay = canPlay
      })

      if (!hasDiff && e.data === window.YT.PlayerState.ENDED) { // ループ再生
        const currentPlaying = currentTimeYouTubes(youTubes).find(y => y.contentID === contentID)
        if (currentPlaying) {
          const player = playerRef.current[contentID]
          if (hasReadyPlayer(player)) {
            player.seekTo(currentPlaying.startAtSec)
            startMuteVideo(player)
          }
        }
      }

      return hasDiff ? [...youTubes] : youTubes
    })
  }, [currentTimeYouTubes])

  const preloadYouTubes = useCallback(() => {
    youTubeIDs.forEach(id => {
      const elementID = 'youtube-player-' + id
      document.getElementById(elementID).parentElement.style.display = 'none' // 親要素ごと非表示にしておき、読み込み中のプレーヤーが表示されるのを抑止
      playerRef.current[id] = new window.YT.Player(elementID, {
        videoId: id,
        playerVars: { rel: 0, controls: 0, autoplay: 1, mute: 1, iv_load_policy: 3 },
        events: {
          onReady: (e) => { handlePlayerReady(e, id) },
          onStateChange: e => { handlePlayerStateChange(e, id)},
        },
      })
    })
  }, [youTubeIDs, handlePlayerReady, handlePlayerStateChange])

  const stopAndHidePlayer = useCallback(contentID => {
    const player = playerRef.current[contentID]
    if (!hasReadyPlayer(player)) return
    player.pauseVideo()
    player.getIframe().style.display = 'none'
  }, [])

  const finishIfNeeded = useCallback(() => {
    setYouTubes(youTubes => {
      let hasDiff = false
      youTubes.filter(y => y.isPlaying && elapsedTimeRef.current > y.elapsedTime + y.durationSec).forEach(youTube => {
        hasDiff = youTube.isPlaying
        youTube.isPlaying = false
        stopAndHidePlayer(youTube.contentID)
      })
      return hasDiff ? [...youTubes] : youTubes
    })
  }, [stopAndHidePlayer])

  const stopYouTube = useCallback(() => {
    setIsPlaying(false)

    setYouTubes(youTubes => {
      youTubes.forEach(youTube => {
        if (!youTube.contentID) return
        youTube.isPlaying = false
        const player = playerRef.current[youTube.contentID]
        if (hasReadyPlayer(player)) player.pauseVideo() // 行追加直後など既存のplayerが初期化されるタイミングがある
      })
      return [...youTubes]
    })
  }, [])

  const seekYoutube = useCallback((e, allowSeekAhead) => {
    elapsedTimeRef.current = parseFloat(e.target.value)

    const shouldResume = isPlaying
    setIsPlaying(false)

    setYouTubes(youTubes => {
      // 一旦全て停止し、プレーヤーを非表示
      youTubes.forEach(youTube => {
        youTube.isPlaying = false
        stopAndHidePlayer(youTube.contentID)
      })

      // 今回の対象をシークし、プレーヤーを再表示
      youTubes.forEach(youTube => {
        if (elapsedTimeRef.current < youTube.elapsedTime) return
        if (elapsedTimeRef.current > youTube.elapsedTime + youTube.durationSec) return

        const player = playerRef.current[youTube.contentID]
        if (!hasReadyPlayer(player)) return
        const seekAt = elapsedTimeRef.current - youTube.elapsedTime + youTube.startAtSec
        const durationSec = player.playerInfo.duration - youTube.startAtSec
        player.seekTo(seekAt % durationSec + youTube.startAtSec, allowSeekAhead) // ループを加味してシークする

        if (shouldResume) {
          startMuteVideo(player)
          youTube.isPlaying = true
        }

        player.getIframe().style.display = 'block'
      })

      if (shouldResume) setIsPlaying(true)

      return [...youTubes]
    })
  }, [isPlaying, stopAndHidePlayer])

  const updateYouTube = useCallback((incrementalTime) => {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime

    if (newElapsedTime < durationSec) {
      elapsedTimeRef.current = newElapsedTime
      playIfNeeded()
      finishIfNeeded()
    } else {
      stopYouTube()
      elapsedTimeRef.current = durationSec
    }
  }, [durationSec, playIfNeeded, finishIfNeeded, stopYouTube])

  const cleanAllPlayers = useCallback(() => {
    Object.values(playerRef.current).forEach(player => {
      if (!hasReadyPlayer(player)) return
      player.stopVideo()
      player.destroy()
    })
    playerRef.current = {}

    shouldUpdatePlayerRef.current = true
  }, [])

  useEffect(() => {
    const newYouTubes = []
    setYouTubes(currents => {
      embeddings.forEach((embedding, i) => {
        if (embedding.serviceName !== 'youtube' || embedding.action !== 'show' || !embedding.contentID) return
        const nextEmbedding = embeddings[i + 1]
        const videoDurationSec = (nextEmbedding ? nextEmbedding.elapsedTime : durationSec) - embedding.elapsedTime
        const currentYouTube = currents.find(y => y.contentID === embedding.contentID)
        const canPlay = currentYouTube ? currentYouTube.canPlay : false
        const isPlayerReady = currentYouTube ? currentYouTube.isPlayerReady : false
        newYouTubes.push({ ...embedding, durationSec: videoDurationSec, canPlay, isPlayerReady, isPlaying: false })
      })
      return newYouTubes
    })

    setYouTubeIDs(ids => {
      const newIDs = Array.from(new Set(newYouTubes.map(y => y.contentID).filter(id => !!id)))
      if (ids.length !== newIDs.length || newIDs.some(newID => !ids.includes(newID))) {
        cleanAllPlayers()
        return newIDs
      } else {
        hideAllPlayers()
        return ids // embeddingsは更新されたがコンテンツIDに変化がなかったので更新しない
      }
    })
  }, [embeddings, durationSec, cleanAllPlayers, hideAllPlayers])

  useEffect(() => {
    if (youTubeIDs.length === 0) return
    if (!shouldUpdatePlayerRef.current) return

    shouldUpdatePlayerRef.current = false
    preloadYouTubes()
  }, [youTubeIDs, preloadYouTubes])

  useEffect(() => {
    const shouldLoading = currentTimeYouTubes(youTubes).some(y => !y.canPlay || !y.isPlayerReady)
    setIsLoading(shouldLoading)

    if (youTubes.every(y => y.isPlayerReady) && youTubes.length > 0) {
      const player = playerRef.current[youTubes[0].contentID]
      if (hasReadyPlayer(player)) {
        player.getIframe().parentElement.style.display = 'block' // 全てのプレーヤーが準備できたので親要素の表示は元に戻す
      }
    }
  }, [youTubes, isPlaying, currentTimeYouTubes])

  useEffect(() => {
    if (embeddings.length > 0) return
    // 別の授業に遷移時、embeddingsがクリアされるタイミングで動画を停止し、経過時間をリセット
    stopYouTube()
    cleanAllPlayers()
    elapsedTimeRef.current = 0
  }, [embeddings, stopYouTube, cleanAllPlayers])

  return { isLoading, isPlaying, youTubeIDs, playYouTube: playIfNeeded, stopYouTube, updateYouTube, seekYoutube }
}