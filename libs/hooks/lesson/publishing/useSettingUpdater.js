import { useRef, useReducer } from 'react'
import useLessonCacheController from '../edit/useLessonCacheController'
import { dataURLToFile } from '../../../graphicUtils'

const sampleJapaneseText = '合成音声のサンプルです'
const sampleEnglishText = 'This is a sample of synthesized voice.'

export default function useSettingUpdater({ isLoading, lesson, bgImages }) {
  const newSettingRef = useRef({})
  const sampleTextForSynthesisRef = useRef(sampleJapaneseText)
  const [setting, dispatchSetting] = useReducer(settingReducer, { voiceSynthesisConfig: {} })
  const { isExistsCache, isExistsDiff, clearDiffFlag, getCache, clearCache } = useLessonCacheController({ isLoading, lessonID: lesson.id })

  function settingReducer(state, { type, payload }) {
    storeNewSetting(state, payload)
    switch (type) {
    case 'initialize':
      return { ...payload }
    case 'thumbnailURL':
      return { ...state, thumbnailURL: payload }
    case 'title':
      return { ...state, title: payload }
    case 'description':
      return  { ...state, description: payload }
    case 'subjectID':
      return { ...state, subjectID: payload, categoryID: undefined }
    case 'categoryID':
      return { ...state, categoryID: payload }
    case 'status':
      return { ...state, status: payload }
    case 'prevLessonID':
      return { ...state, prevLessonID: payload || 0 }
    case 'nextLessonID':
      return { ...state, nextLessonID: payload || 0 }
    case 'addReference':
      return { ...state, references: [...state.references, payload] }
    case 'removeReference': {
      const references = [...state.references]
      references.splice(payload, 1)
      return { ...state, references }
    }
    case 'updateReference': {
      const reference = state.references[payload.targetIndex]
      if (payload.isbn) reference.isbn = payload.isbn
      if (payload.name) reference.name = payload.name
      state.references[payload.targetIndex] = reference
      return { ...state, references: [...state.references] }
    }
    case 'backgroundImageID': {
      const url = bgImages.find(i => i.id === payload).url
      return { ...state, backgroundImageID: payload, backgroundImageURL: url }
    }
    case 'avatarID':
      return { ...state, avatarID: payload }
    case 'avatarLightColor':
      return { ...state, avatarLightColor: payload }
    case 'synthesisName':
      return { ...state, voiceSynthesisConfig: { ...state.voiceSynthesisConfig, name: payload } }
    case 'initializeSynthesis':
      sampleTextForSynthesisRef.current = (payload.languageCode === 'ja-JP') ? sampleJapaneseText : sampleEnglishText
      return { ...state, voiceSynthesisConfig: { ...state.voiceSynthesisConfig, languageCode: payload.languageCode, name: payload.name } }
    case 'synthesisSpeakingRate':
      return { ...state, voiceSynthesisConfig: { ...state.voiceSynthesisConfig, speakingRate: payload } }
    case 'synthesisPitch':
      return { ...state, voiceSynthesisConfig: { ...state.voiceSynthesisConfig, pitch: payload } }
    case 'synthesisVolumeGainDb':
      return { ...state, voiceSynthesisConfig: { ...state.voiceSynthesisConfig, volumeGainDb: payload } }
    case 'synthesisVoice':
      return state // サンプルボイスのため、settingには影響させない
    default:
      throw new Error()
    }
  }

  function storeNewSetting(name, value) {
    newSettingRef.current[name] = value
  }

  function handleFormSubmit() {
    console.log('handleFormSubmit')
    /* lesson.published に公開され、その後 material.updated に変更されました。 */
  }

  return { sampleTextForSynthesisRef, setting, dispatchSetting, handleFormSubmit }
}