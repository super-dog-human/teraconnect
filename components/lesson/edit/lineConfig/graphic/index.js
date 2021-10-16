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
  const [isInvalidSelected, setIsInvalidSelected] = useState(false)

  function configReducer(state, { type, payload }) {
    switch (type) {
    case 'elapsedTime':
      return { ...state, elapsedTime: payload }
    case 'action':
      return { ...state, action: payload }
    case 'graphicID':
      return { ...state, graphicID: payload }
    default:
      throw new Error()
    }
  }

  function handleActionChange(e) {
    dispatchConfig({ type: 'action', payload: e.target.value })
  }

  function handleGraphicClick(e) {
    const graphicID = e.currentTarget.dataset.graphicId
    if (graphicID.startsWith('tmp_')) return false
    dispatchConfig({ type: 'graphicID', payload: parseInt(graphicID) })
  }

  function handleConfirm(changeAfterLineElapsedTime) {
    if (isInvalidSelected) return

    if (config.action === 'hide') {
      delete config.graphicID
    }

    updateLine({ kind: 'graphic', index, elapsedTime: initialConfig.elapsedTime, newValue: config, changeAfterLineElapsedTime })
    closeCallback()
  }

  function handleCancel() {
    closeCallback(true)
  }

  useEffect(() => {
    if (config.action === 'show' && !config.graphicID) {
      setIsInvalidSelected(true)
    } else {
      setIsInvalidSelected(false)
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
          <DialogFooter elapsedTime={config.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} />
        </ContainerSpacer>
      </Container>
    </>
  )
}