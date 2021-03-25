/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Flex from '../../../../flex'
import ContainerSpacer from '../../../../containerSpacer'
import Spacer from '../../../../spacer'
import InputText from '../../../../form/inputText'
import PlainText from '../../../../plainText'
import ColorPickerCube from '../../../../colorPickerCube'
import TextAlignButton from './textAlignButton'
import DialogFooter from '../dialogFooter'
import useSpeechTextEdit from '../../../../../libs/hooks/lesson/edit/useSpeechTextEdit'

export default function TextTab({ config, onCancel, onConfirm }) {
  const speechText = useSpeechTextEdit(config)

  return (
    <ContainerSpacer top='30' left='50' right='50'>
      <Spacer height='10' />
      <PlainText size='13' color='var(--soft-white)'>字幕</PlainText>
      <Spacer height='13' />
      <InputText size='18' color='var(--soft-white)' borderWidth='0 0 1px' borderColor='var(--text-gray)' key={config.subtitle} defaultValue={config.subtitle} />
      <Spacer height='50' />
      <PlainText size='13' color='var(--soft-white)'>テロップ</PlainText>
      <Spacer height='13' />
      <InputText size='18' color='var(--soft-white)' borderWidth='0 0 1px' borderColor='var(--text-gray)' key={config.caption?.body} defaultValue={config.caption?.body} />
      <ContainerSpacer top='10' left='20'>
        <Flex alignItems='center' justifyContent='flex-start'>
          <ColorPickerCube initialColor={config.caption?.bodyColor || '#ff0000'} size='20' onChange={speechText.changeBodyColor} />
          <Spacer width='10' />
          <ColorPickerCube initialColor={config.caption?.borderColor || '#0000ff'} isBorder={true} size='20' onChange={speechText.changeBorderColor} />
          <Spacer width='30' />
          {['left', 'center', 'right'].map(align =>
            <TextAlignButton align={align} key={align} value={config.caption?.horizontalAlign} onClick={speechText.changeHorizontalAlign} />
          )}
          <Spacer width='30' />
          {['top', 'middle', 'bottom'].map(align =>
            <TextAlignButton align={align} key={align} value={config.caption?.verticalAlign} onClick={speechText.changeVerticalAlign} />
          )}
        </Flex>
      </ContainerSpacer>
      <DialogFooter elapsedtime={config.elapsedtime} onCancel={onCancel} onConfirm={onConfirm} />
    </ContainerSpacer>
  )
}