import { useRef, useState, useReducer, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useSynthesisVoice from '../../useSynthesisVoice'
import useAudioPlayer from '../../useAudioPlayer'
import { isBlobURL } from '../../../utils'
import fetch from 'isomorphic-unfetch'
import useFetch from '../../useFetch'
import { putFile } from '../../../fetch'
import { wavToMp3 } from '../../../audioUtils'
import { voiceURL } from '../../../speechUtils'

export default function useSpeechConfig({ index, initialConfig, closeCallback }) {
  const router = useRouter()
  const lessonIDRef = useRef(parseInt(router.query.id))
  const { showError } = useErrorDialogContext()
  const { updateLine, generalSetting } = useLessonEditorContext()
  // propsをタブの初期値としてstateにコピーし、確定時にコピー元を更新する
  const [config, dispatchConfig] = useReducer(configReducer, { ...initialConfig })
  const [isProcessing, setIsProcessing] = useState(false)
  const { createSynthesisVoiceFile } = useSynthesisVoice(generalSetting.voiceSynthesisConfig)
  const { createAudio } = useAudioPlayer()
  const { post } = useFetch()

  function configReducer(state, { type, payload }) {
    switch (type) {
    case 'elapsedTime':
      return { ...state, elapsedTime: payload }
    case 'url':
      return { ...state, url: payload }
    case 'switchToSynthesis':
      return { ...state, url: payload.url, voiceID: payload.voiceID, voiceFileKey: payload.voiceFileKey, isSynthesis: true }
    case 'switchToHuman':
      return { ...state, url: payload.url, voiceID: payload.voiceID, voiceFileKey: payload.voiceFileKey, isSynthesis: false }
    case 'initializeSynthesis':
      return { ...state, synthesisConfig: { ...payload } }
    case 'synthesisLanguageAndName':
      return { ...state, url: '', synthesisConfig: { ...state.synthesisConfig, languageCode: payload.languageCode, name: payload.name } }
    case 'synthesisName':
      return { ...state, url: '', synthesisConfig: { ...state.synthesisConfig, name: payload } }
    case 'synthesisSpeakingRate':
      return { ...state, url: '', synthesisConfig: { ...state.synthesisConfig, speakingRate: parseFloat(payload) } }
    case 'synthesisPitch':
      return { ...state, url: '', synthesisConfig: { ...state.synthesisConfig, pitch: parseInt(payload) } }
    case 'synthesisVolumeGainDb':
      return { ...state, url: '', synthesisConfig: { ...state.synthesisConfig, volumeGainDb: parseInt(payload) } }
    case 'synthesisVoice':
      return { ...state, url: payload.url, voiceID: payload.voiceID, voiceFileKey: payload.voiceFileKey }
    case 'synthesisSubtitle':
      return { ...state, url: '', subtitle: payload }
    case 'humanVoice':
      return { ...state, url: payload, voiceID: 0, voiceFileKey: '' }
    case 'subtitle':
      return { ...state, subtitle: payload }
    case 'captionBody':
      return { ...state, caption: { ...state.caption, body: payload } }
    case 'captionBodyColor':
      return { ...state, caption: { ...state.caption, bodyColor: payload } }
    case 'captionBorderColor':
      return { ...state, caption: { ...state.caption, borderColor: payload } }
    case 'captionHorizontalAlign':
      return { ...state, caption: { ...state.caption, horizontalAlign: payload } }
    case 'captionVerticalAlign':
      return { ...state, caption: { ...state.caption, verticalAlign: payload } }
    default:
      throw new Error()
    }
  }

  async function handleConfirm(changeAfterLineElapsedTime) {
    setIsProcessing(true)

    updateSpeech(changeAfterLineElapsedTime).catch(e => {
      showError({
        message: '音声データのURL生成に失敗しました。',
        original: e,
        canDismiss: true,
        callback: () => { handleConfirm(changeAfterLineElapsedTime) },
        dismissCallback: () => { setIsProcessing(false) },
      })
    })
  }

  async function updateSpeech(changeAfterLineElapsedTime) {
    if (!config.url) {
      if (config.isSynthesis && config.subtitle) {
        const voice = await createSynthesisVoiceFile({ lessonID: lessonIDRef.current, subtitle: config.subtitle, synthesisConfig: config.synthesisConfig })
        config.voiceID = voice.id
        config.voiceFileKey = voice.fileKey
        config.url = voiceURL(lessonIDRef.current, voice.id, voice.fileKey)
      } else if (!config.isSynthesis && config.voiceID > 0) {
        config.url = voiceURL(lessonIDRef.current, config.voiceID, config.voiceFileKey)
      } else {
        // 合成だがsubtitleが未入力、または録音だがvoiceIDがない場合、声はなしになる
        config.voiceID = 0
        config.voiceFileKey = ''
        config.durationSec = 0
      }
    }

    if (config.url) {
      updateSpeechWithAudio(config, changeAfterLineElapsedTime)
    } else {
      updateSpeechWithoutAudio(config, changeAfterLineElapsedTime)
    }
  }

  function updateSpeechWithAudio(config, changeAfterLineElapsedTime) {
    // 音声の長さは読み込まないと分からないので以後の処理はコールバックになる
    createAudio(config.url, async audio => {
      audioCallback(audio).catch(e => {
        showError({
          message: '音声データの変換に失敗しました。',
          original: e,
          canDismiss: true,
          callback: () => updateSpeechWithAudio(config, changeAfterLineElapsedTime),
        })
      })
    })

    async function audioCallback(audio) {
      config.durationSec = parseFloat(audio.duration.toFixed(3))
      if (!config.isSynthesis) {
        config.synthesisConfig = {} // 不要な設定の削除
      }

      if (isBlobURL(config.url)) {
        const voice = await createHumanVoice(config.url, config.elapsedTime, config.durationSec)
        URL.revokeObjectURL(config.url)
        config.voiceID = voice.id
        config.voiceFileKey = voice.fileKey
      }

      delete config.url
      updateLine({ kind: 'speech', index, elapsedTime: initialConfig.elapsedTime, newValue: config, changeAfterLineElapsedTime })
      setIsProcessing(false)
      closeCallback()
    }

    async function createHumanVoice(blobURL, elapsedTime, durationSec) {
      const file = await (await fetch(blobURL)).blob()
      const mp3File = (file.type === 'audio/wav') ? await wavToMp3(file) : file
      const voice = await post('/voice', { elapsedTime, durationSec, lessonID: lessonIDRef.current })
      await putFile(voice.signedURL, mp3File, mp3File.type)
      return voice
    }
  }

  function updateSpeechWithoutAudio(config, changeAfterLineElapsedTime) {
    updateLine({ kind: 'speech', index, elapsedTime: initialConfig.elapsedTime, newValue: config, changeAfterLineElapsedTime })
    setIsProcessing(false)
    closeCallback()
  }

  function handleCancel() {
    closeCallback(true)
  }

  useEffect(() => {
    if (initialConfig.voiceID === 0) return
    dispatchConfig({ type: 'url', payload: voiceURL(lessonIDRef.current, initialConfig.voiceID, initialConfig.voiceFileKey) })
  }, [initialConfig.voiceID, initialConfig.voiceFileKey])

  useEffect(() => {
    if (config.isSynthesis) {
      if (config.synthesisConfig.name) return
      dispatchConfig({ type: 'initializeSynthesis', payload: generalSetting.voiceSynthesisConfig })
    } else {
      if (Object.keys(config.synthesisConfig).length === 0) return
      dispatchConfig({ type: 'initializeSynthesis', payload: {} })
    }
  }, [config.isSynthesis, config.synthesisConfig, generalSetting.voiceSynthesisConfig])

  return { isProcessing, config, dispatchConfig, handleConfirm, handleCancel }
}