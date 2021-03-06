import React from 'react'
import Flex from '../../../../flex'
import ContainerSpacer from '../../../../containerSpacer'
import Spacer from '../../../../spacer'
import SpeechInputText from './speechInputText'
import PlainText from '../../../../plainText'
import ColorPickerCube from '../../../../colorPickerCube'
import TextAlignButton from './textAlignButton'
import useSpeechTextEditor from '../../../../../libs/hooks/lesson/edit/useSpeechTextEditor'

export default function TextTab({ config, dispatchConfig }) {
  const { setSubtitle, setBody, setBodyColor, setBorderColor, setHorizontalAlign, setVerticalAlign } = useSpeechTextEditor(dispatchConfig)

  return (
    <ContainerSpacer top='30' left='50' right='50'>
      <PlainText size='13' color='var(--border-gray)'>字幕</PlainText>
      <Spacer height='13' />
      <SpeechInputText defaultValue={config.subtitle} onBlur={setSubtitle} />
      <Spacer height='50' />
      <PlainText size='13' color='var(--border-gray)'>テロップ</PlainText>
      <Spacer height='13' />
      <SpeechInputText defaultValue={config.caption?.body} onBlur={setBody} />
      <ContainerSpacer top='10' left='20'>
        <Flex alignItems='center' justifyContent='flex-start'>
          <ColorPickerCube initialColor={config.caption?.bodyColor || '#ffffff'} size='20' onChange={setBodyColor} />
          <Spacer width='10' />
          <ColorPickerCube initialColor={config.caption?.borderColor || '#0000ff'} isBorder={true} size='20' onChange={setBorderColor} />
          <Spacer width='30' />
          <TextAlignButton align='left' value={config.caption?.horizontalAlign} onClick={setHorizontalAlign} />
          <Spacer width='3' />
          <TextAlignButton align='center' value={config.caption?.horizontalAlign} onClick={setHorizontalAlign} />
          <Spacer width='3' />
          <TextAlignButton align='right' value={config.caption?.horizontalAlign} onClick={setHorizontalAlign} />
          <Spacer width='20' />
          <TextAlignButton align='top' value={config.caption?.verticalAlign} onClick={setVerticalAlign} />
          <Spacer width='3' />
          <TextAlignButton align='middle' value={config.caption?.verticalAlign} onClick={setVerticalAlign} />
          <Spacer width='3' />
          <TextAlignButton align='bottom' value={config.caption?.verticalAlign} onClick={setVerticalAlign} />
        </Flex>
      </ContainerSpacer>
    </ContainerSpacer>
  )
}

