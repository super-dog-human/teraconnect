import { useState, useReducer, useRef, useEffect } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import useAudioPlayer from '../../useAudioPlayer'
import { useDialogContext } from '../../../contexts/dialogContext'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useFetch from '../../useFetch'
import { putFile } from '../../../fetch'
import { TEN_MB as maxFileByteSize } from '../../../constants'

export default function useMusicConfig({ index, initialConfig, closeCallback }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [config, dispatchConfig] = useReducer(configReducer, initialConfig)
  const { musicURLs, setMusicURLs, updateLine } = useLessonEditorContext()
  const { isPlaying, createAudio, switchAudio, changeVolume } = useAudioPlayer()
  const inputFileRef = useRef()
  const [musicOptions, setMusicOptions] = useState([])
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()
  const { post } = useFetch()

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
      return { ...state, isFading: payload }
    case 'isLoop':
      return { ...state, isLoop: payload }
    default:
      throw new Error()
    }
  }

  function handleFileOpen() {
    inputFileRef.current.click()
  }

  function handleFileChange(e) {
    setIsProcessing(true)

    const file = e.target.files[0]
    const fileName = file.name.slice(0, -4).trim()

    inputFileRef.current.value = ''

    if (file.size > maxFileByteSize || fileName.length === 0) {
      showDialog({
        title: 'BGMファイルエラー',
        message: 'ファイル名が空白のみで構成されているか、サイズが10MBを超えています。',
        canDismiss: true,
        dismissName: '閉じる',
        dismissCallback: () => { setIsProcessing(false) },
      })

      return
    }

    createNewMusic(file, fileName)

    function createNewMusic(file, fileName) {
      post('/background_musics', { name: fileName }).then(result => {
        uploadMusicFile(result, file, fileName)
      }).catch(e => {
        showError({
          message: 'BGMの作成に失敗しました。',
          original: e,
          canDismiss: true,
          callback: () => {
            createNewMusic(file, fileName)
          },
          dismissCallback: () => { setIsProcessing(false) },
        })
      })
    }

    function uploadMusicFile(music, file, fileName) {
      putFile(music.signedURL, file, file.type).then(() => {
        setMusicURLs(urls => ({ [music.fileID]: { name: fileName, url: URL.createObjectURL(file) }, ...urls }))
        setIsProcessing(false)
      }).catch(e => {
        showError({
          message: 'BGMのアップロードに失敗しました。',
          original: e,
          canDismiss: true,
          callback: () => {
            uploadMusicFile(music, file, fileName)
          },
          dismissCallback: () => { setIsProcessing(false) },
        })
      })
    }
  }

  function handleActionChange(e) {
    dispatchConfig({ type: 'action', payload: e.target.value })
  }

  function handleMusicChange(e) {
    const musicID = parseInt(e.target.value)
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

  function handleFadeChange(e) {
    dispatchConfig({ type: 'isFading', payload: e.target.checked })
  }

  function handleLoopChange(e) {
    dispatchConfig({ type: 'isLoop', payload: e.target.checked })
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
    const musicURLsLength = Object.keys(musicURLs).length
    if (musicURLsLength > 0 && musicURLsLength !== musicOptions.length) {
      setMusicOptions(Object.keys(musicURLs).map(musicID => ({ value: parseInt(musicID), label: musicURLs[musicID].name })))

      if (config.backgroundMusicID) {
        setCurrentAudio(config.backgroundMusicID)
      } else {
        const musicID = parseInt(Object.keys(musicURLs)[0])
        dispatchConfig({ type: 'backgroundMusicID', payload: musicID })
        setCurrentAudio(musicID)
      }
    }
  }, [musicURLs, musicOptions])

  return { config, dispatchConfig, musicOptions, isPlaying, isProcessing, inputFileRef, handleFileChange, handleActionChange, handleMusicChange, handlePlayClick,
    handleVolumeChange, handleFileOpen, handleFadeChange, handleLoopChange, handleConfirm, handleCancel }
}