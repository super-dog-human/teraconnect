import { useState, useReducer } from 'react'
import { useLessonEditorContext } from '../../../contexts/lessonEditorContext'
import { fetchDocument } from '../../../fetch'

export default function useEmbeddingConfig({ index, initialConfig, closeCallback }) {
  const serviceOptions = [
    { value: 'youtube', label: 'YouTube' },
    { value: 'geogebra', label: 'GeoGebra' },
  ]

  const { updateLine } = useLessonEditorContext()
  const [config, dispatchConfig] = useReducer(configReducer, initialConfig)
  const [isInvalidInput, setIsInvalidInput] = useState(false)

  function configReducer(state, { type, payload }) {
    switch (type) {
    case 'elapsedTime':
      return { ...state, elapsedTime: payload }
    case 'action':
      if (payload === 'show' && initialConfig.action === 'hide') {
        return { ...state, action: 'show', serviceName: 'youtube', contentID: '' } // 初期値
      } else {
        return { ...state, action: payload }
      }
    case 'serviceName':
      if (payload === initialConfig.serviceName) {
        return { ...state, serviceName: payload, contentID: initialConfig.contentID }
      } else {
        return { ...state, serviceName: payload, contentID: '' }
      }
    case 'contentID':
      return { ...state, contentID: payload }
    default:
      throw new Error()
    }
  }

  function handleServiceChange(e) {
    dispatchConfig({ type: 'serviceName', payload: e.target.value })
  }

  function handleContentIDBlur(e) {
    const id = e.currentTarget.value

    if (config.serviceName === 'youtube' && id.length === 11) {
      setIsInvalidInput(false)
    } else if (config.serviceName === 'geogebra' && id.length === 8) {
      setIsInvalidInput(false)
    } else {
      setIsInvalidInput(true)
    }
    dispatchConfig({ type: 'contentID', payload: id })
  }

  function handleConfirm(changeAfterLineElapsedTime) {
    if (config.action === 'hide') {
      delete config.serviceName
      delete config.contentID
    }

    if (config.serviceName === 'geogebra') {
      console.log(config.contentID)
      /*
//const geogebraURL = 'https://www.geogebra.org/material/iframe/id/{contentID}/width/1600/height/715/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/false/ld/false/sri/false/ctl/false/sfsb/false/szb/false'
const geogebraURL = 'https://www.geogebra.org/material/iframe/id/'
//const geogebraURL = 'https://www.geogebra.org/m/'
*/
      fetchDocument('https://www.geogebra.org/material/iframe/' + config.contentID + 'width/1600/height/715/border/888888/rc/false/ai/false/sdz/false/smb/false/stb/false/stbh/false/ld/false/sri/false/ctl/false/sfsb/false/szb/false').then(body => {
        console.log(body)
      })
    }

    updateLine({ kind: 'embedding', index, elapsedTime: initialConfig.elapsedTime, newValue: config, changeAfterLineElapsedTime })
    closeCallback()
  }

  function handleCancel() {
    closeCallback(true)
  }

  return { config, dispatchConfig, serviceOptions, isInvalidInput, handleServiceChange, handleContentIDBlur, handleConfirm, handleCancel }
}