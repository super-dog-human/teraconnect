import { useState, useRef, useReducer, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import useFetch from '../../useFetch'
import { putFile } from '../../../fetch'
import { dataURLToBlob } from '../../../graphicUtils'
import { filterObject } from '../../../utils'
import { updateGeneralSettingCache } from '../../../localStorageUtil'

const sampleJapaneseText = '合成音声のサンプルです'
const sampleEnglishText = 'This is a sample of synthesized voice.'

export default function useSettingUpdater({ lesson, material, bgImages }) {
  const [isUpdating, setIsUpdating] = useState(false)
  const [isUpdated, setIsUpdated] = useState(false)
  const newSettingRef = useRef({})
  const sampleTextForSynthesisRef = useRef('')
  const [setting, dispatchSetting] = useReducer(settingReducer, { voiceSynthesisConfig: {} })
  const { post } = useFetch()
  const { showError } = useErrorDialogContext()

  function settingReducer(state, { type, payload }) {
    if (type === 'initialize')     return payload
    if (type === 'synthesisVoice') return state // サンプルボイスのため、settingは更新しない

    if (type === 'synthesisLanguageAndName') {
      sampleTextForSynthesisRef.current = (payload.languageCode === 'ja-JP') ? sampleJapaneseText : sampleEnglishText
    }

    const settingObj = newSetting({ state, type, payload })

    if (/^synthesis.*/.test(type)) {
      newSettingRef.current.voiceSynthesisConfig = { ...newSettingRef.current.voiceSynthesisConfig, ...settingObj }
      return { ...state, voiceSynthesisConfig: { ...state.voiceSynthesisConfig, ...settingObj } }
    }

    if (type === 'avatarLightColor') {
      const avatarLightColor = Object.values(settingObj.avatarLightColor).join(',')
      newSettingRef.current = { ...newSettingRef.current, avatarLightColor }
    } else if (type === 'categoryID') {
      newSettingRef.current = { ...newSettingRef.current, japaneseCategoryID: settingObj.categoryID }
    } else {
      newSettingRef.current = { ...newSettingRef.current, ...settingObj }
    }

    return { ...state, ...settingObj }
  }

  function newSetting({ state, type, payload }) {
    switch (type) {
    case 'thumbnailURL':
    case 'title':
    case 'description':
    case 'categoryID':
    case 'status':
    case 'prevLessonID':
    case 'nextLessonID':
    case 'avatarID':
    case 'avatarLightColor':
      return { [type]: payload }
    case 'subjectID':
      return { subjectID: payload, categoryID: undefined }
    case 'addReference':
      return { references: [...state.references, payload] }
    case 'removeReference': {
      const references = [...state.references]
      references.splice(payload, 1)
      return { references }
    }
    case 'updateReference': {
      const reference = state.references[payload.targetIndex]
      if (payload.isbn) reference.isbn = payload.isbn
      if (payload.name) reference.name = payload.name
      state.references[payload.targetIndex] = reference
      return { references: [...state.references] }
    }
    case 'backgroundImageID': {
      const url = bgImages.find(i => i.id === payload).url
      return { backgroundImageID: payload, backgroundImageURL: url }
    }
    case 'synthesisName':
      return { name: payload }
    case 'synthesisLanguageAndName':
      return { languageCode: payload.languageCode, name: payload.name }
    case 'synthesisSpeakingRate':
      return { speakingRate: parseFloat(payload) }
    case 'synthesisPitch':
      return { pitch: parseInt(payload) }
    case 'synthesisVolumeGainDb':
      return { volumeGainDb: parseInt(payload) }
    default:
      throw new Error()
    }
  }

  function handleSubmitClick() {
    setIsUpdated(false)

    if (isUpdating) return
    if (Object.values(newSettingRef.current).length === 0) return

    setIsUpdating(true)
    updateSetting()
  }

  async function updateSetting() {
    const thumbnailURL = newSettingRef.current.thumbnailURL
    if (thumbnailURL && !lesson.hasThumbnail) {
      newSettingRef.current.hasThumbnail = true
    }

    await post(`/lessons/${lesson.id}`, newSettingRef.current, 'PATCH')
      .then(async () => {
        setGeneralSettingToCache()
        newSettingRef.current = {}

        if (thumbnailURL) {
          uploadThumbnail(thumbnailURL)
        } else {
          newSettingRef.current = {}
          setIsUpdating(false)
          setIsUpdated(true)
        }
      }).catch(e => {
        showError({
          message: '公開設定の更新に失敗しました。',
          original: e,
          canDismiss: true,
          callback: () => {
            updateSetting()
          },
          dismissCallback: () => {
            setIsUpdating(false)
          }
        })
        console.error(e)
      })
  }

  async function uploadThumbnail(url) {
    post(`/lessons/${lesson.id}/thumbnail`).then(async (r) => {
      const file = dataURLToBlob(url, 'image/png')
      uploadImageFile(r.url, file)
    }).catch(e => {
      showError({
        message: 'サムネイル作成の準備に失敗しました。',
        original: e,
        canDismiss: true,
        callback: () => {
          uploadThumbnail(url)
        },
        dismissCallback: () => {
          setIsUpdating(false)
        },
      })
      console.error(e)
    })
  }

  function uploadImageFile(url, file) {
    putFile(url, file, file.type).then(() => {
      setIsUpdating(false)
      setIsUpdated(true)
    }).catch(e => {
      showError({
        message: 'サムネイルのアップロードに失敗しました。',
        original: e,
        canDismiss: true,
        callback: () => {
          uploadImageFile(url, file)
        },
        dismissCallback: () => {
          setIsUpdating(false)
        },
      })
      console.error(e)
    })
  }

  function setGeneralSettingToCache() {
    const newSetting = filterObject(newSettingRef.current, ['avatarLightColor', 'backgroundImageID', 'backgroundImageURL', 'voiceSynthesisConfig'])
    if (Object.keys(newSetting).length === 0) return

    updateGeneralSettingCache(lesson.id, newSetting)
  }

  useEffect(() => {
    if (sampleTextForSynthesisRef.current) return

    if (material.voiceSynthesisConfig.languageCode === 'ja-JP') {
      sampleTextForSynthesisRef.current = sampleJapaneseText
    } else {
      sampleTextForSynthesisRef.current = sampleEnglishText
    }
  }, [material.voiceSynthesisConfig])

  return { isUpdating, isUpdated, sampleTextForSynthesisRef, setting, dispatchSetting, handleSubmitClick }
}