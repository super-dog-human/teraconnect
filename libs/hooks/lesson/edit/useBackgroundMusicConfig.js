import { useState, useReducer, useRef, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useAudioPlayer from '../../useAudioPlayer'
import { filterAvailableAudios } from '../../../audioUtils'

export default function useBackgroundMusicConfig({ index, initialConfig, closeCallback }) {
  const [config, dispatchConfig] = useReducer(configReducer, initialConfig)
  const { musicURLs, updateLine } = useLessonEditorContext()
  const { isPlaying, createAudio, switchAudio, changeVolume } = useAudioPlayer()
  const inputFileRef = useRef()
  const [musicOptions, setMusicOptions] = useState([])

  function configReducer(state, { type, payload }) {
    switch (type) {
    case 'elapsedTime':
      return { ...state, elapsedTime: payload }
    case 'action':
      return { ...state, action: payload }
    case 'backgroundMusicID':
      return { ...state, backgroundMusicID: payload }
    case 'volume':
      return { ...state, volume: payload }
    case 'isFading':
      return { ...state, isFading: !state.isFading }
    case 'isLoop':
      return { ...state, isLoop: !state.isLoop }

    default:
      throw new Error()
    }
  }

  function handleFileChange(e) {

  }

  function handleActionChange(e) {
    dispatchConfig({ type: 'action', payload: e.target.value })
  }

  function handleMusicChange(e) {
    const musicID = e.target.value
    dispatchConfig({ type: 'backgroundMusicID', payload: musicID })

    if (isPlaying) {
      switchAudio()
      setCurrentAudio(musicID)
      switchAudio()
    } else {
      setCurrentAudio(musicID)
    }
  }

  function setCurrentAudio(musicID) {
    const url = musicURLs[musicID].url
    createAudio(url)
  }

  function handlePlayClick() {
    switchAudio()
  }


  function handleVolumeChange(e) {
    const volume = parseFloat(e.target.value)
    changeVolume(volume)
    dispatchConfig({ type: 'volume', payload: volume })
  }

  function handleFadeChange() {
    dispatchConfig({ type: 'isFading' })
  }

  function handleLoopChange() {
    dispatchConfig({ type: 'isLoop' })
  }

  function handleConfirm(changeAfterLineElapsedTime) {
    if (config.action === 'stop') {
      delete config.backgroundMusicID
      delete config.volume
      delete config.isLoop
    }

    updateLine({ kind: 'music', index, elapsedTime: initialConfig.elapsedTime, newValue: config, changeAfterLineElapsedTime })
    closeCallback()
  }

  function handleCancel() {
    closeCallback(true)
  }

  useEffect(() => {
    if (Object.keys(musicURLs).length > 0 && musicOptions.length === 0) {
      setMusicOptions(Object.keys(musicURLs).map(musicID => ({ value: parseInt(musicID), label: musicURLs[musicID].name })))

      const musicID = parseInt(Object.keys(musicURLs)[0])
      dispatchConfig({ type: 'backgroundMusicID', payload: musicID })
      setCurrentAudio(musicID)
    }
  }, [musicURLs, musicOptions])

  return { config, dispatchConfig, musicOptions, isPlaying, inputFileRef, handleFileChange, handleActionChange, handleMusicChange, handlePlayClick,
    handleVolumeChange, handleFadeChange, handleLoopChange, handleConfirm, handleCancel }
}