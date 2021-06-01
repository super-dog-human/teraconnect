import React, { useState, useReducer, useEffect } from 'react'
import Flex from '../../../../flex'
import Spacer from '../../../../spacer'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import InputRadio from '../../../../form/inputRadio'
import PlainText from '../../../../plainText'
import DialogHeader from '../configDialog/dialogHeader'
import DialogFooter from '../configDialog/dialogFooter'
import Thumbnails from './thumbnails'
import { useLessonEditorContext } from '../../../../../libs/contexts/lessonEditorContext'

export default function Graphic({ index, initialConfig, closeCallback }) {
  const [config, dispatchConfig] = useReducer(configReducer, initialConfig)
  const { graphicURLs, updateLine } = useLessonEditorContext()
  const [invalidSelected, setInvalidSelected] = useState()

  function configReducer(state, { type, payload }) {
    switch (type) {
    case 'elapsedTime':
      return { ...state, elapsedTime: payload }
    case 'action':
      return { ...state, action: payload }
    case 'graphicID': {
      return { ...state, graphicID: payload.graphicID, url: payload.url }
    }
    default:
      throw new Error()
    }
  }

  function handleActionChange(e) {
    dispatchConfig({ type: 'action', payload: e.target.value })
  }

  function handleGraphicClick(e) {
    const graphicID = parseInt(e.currentTarget.dataset.graphicId)
    dispatchConfig({ type: 'graphicID', payload: { graphicID, url: graphicURLs[graphicID].url } })
  }

  function handleConfirm(changeAfterLineElapsedTime) {
    if (config.action === 'hide') {
      delete config.graphicID
      delete config.url
    }

    updateLine({ kind: 'graphic', index, elapsedTime: initialConfig.elapsedTime, newValue: config, changeAfterLineElapsedTime })
    closeCallback()
  }

  function handleCancel() {
    closeCallback(true)
  }

  useEffect(() => {
    if (config.action === 'show' && !config.graphicID) {
      setInvalidSelected(true)
    } else {
      setInvalidSelected(false)
    }
  }, [config])

  return (
    <>
      <DialogHeader onCloseClick={handleCancel} />

      <ContainerSpacer left='50' right='50'>
        <Flex>
          <InputRadio id={'embedding-show'} name='graphicLine' size='16' color='var(--soft-white)'
            value='show' checked={config.action === 'show'} onChange={handleActionChange}>
            <PlainText size='13' lineHeight='18' color='var(--soft-white)'>表示</PlainText>
          </InputRadio>
          <Spacer width='30' />
          <InputRadio id={'embedding-hide'} name='graphicLine' size='16' color='var(--soft-white)'
            value='hide' checked={config.action === 'hide'} onChange={handleActionChange}>
            <PlainText size='13' lineHeight='18' color='var(--soft-white)'>非表示</PlainText>
          </InputRadio>
        </Flex>

        <Spacer height='30' />

        <Container width='600' height='300'>
          <Thumbnails config={config} graphicURLs={graphicURLs} onClick={handleGraphicClick} />
        </Container>
      </ContainerSpacer>

      <Spacer height='20' />

      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={config.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} disabled={invalidSelected} />
        </ContainerSpacer>
      </Container>
    </>
  )
}