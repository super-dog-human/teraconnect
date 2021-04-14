import React from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import FlipIconButton from '../../../../button/flipIconButton'
import IconButton from '../../../../button/iconButton'
import Spacer from '../../../../spacer'
import PlainText from '../../../../plainText'
import InputRange from '../../../../form/inputRange'
import Select from '../../../../form/select'
import InputText from '../../../../form/inputText'
import { Container as GridContainer, Row, Col } from 'react-grid-system'
import useSynthesisVoiceEdit from '../../../../../libs/hooks/lesson/edit/useSynthesisVoiceEdit'

export default function SynthesisVoiceTab({ config, setConfig, switchTab }) {
  const { languageNames, voiceNames, setSubtitle, setLanguageCode, setName, setSpeakingRate, setPitch, setVolumeGainDb,
    playVoice, isSynthesing } = useSynthesisVoiceEdit(config, setConfig)

  return (
    <ContainerSpacer left='50' right='50'>
      <Spacer height='10' />
      <Flex justifyContent='flex-end'>
        <Container width='30' height='30'>
          <FlipIconButton name='robot' flipName='microphone' backgroundColor='var(--dark-gray)' borderColor='var(--dark-gray)' padding='5' onClick={switchTab} />
        </Container>
      </Flex>
      <Spacer height='18' />
      <InputText defaultValue={config.subtitle} key={config.subtitle} size='18' color='var(--soft-white)' borderWidth='0 0 1px' borderColor='var(--text-gray)' onBlur={setSubtitle} />
      <GridContainer>
        <Spacer height='40' />
        <Row>
          <Col md={4}>
            <Select options={languageNames} topLabel={null} value={config.synthesisConfig.languageCode} color='var(--soft-white)' backgroundColor='var(--dark-gray)' onChange={setLanguageCode} />
          </Col>
          <Col md={4}>
            <Select options={voiceNames} topLabel={null} value={config.synthesisConfig.name} color='var(--soft-white)' backgroundColor='var(--dark-gray)' onChange={setName} />
          </Col>
          <Col md={3}></Col>
          <Col md={1}>
            <Container width='35' height='35'>
              <IconButton name='play' backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='10' onClick={playVoice} isProcessing={isSynthesing} />
            </Container>
          </Col>
        </Row>
        <Spacer height='30' />
        <Row>
          <Col md={4}>
            <PlainText size='13' color='var(--soft-white)'>速度</PlainText>
            <ContainerSpacer left='10'>
              <InputRange defaultValue={config.synthesisConfig.speakingRate || '1.2'} min='0.5' max='3.0' step='0.1' onChange={setSpeakingRate} />
            </ContainerSpacer>
            <AlignContainer textAlign='right'>
              <PlainText size='12' color='var(--soft-white)'>{config.synthesisConfig.speakingRate || '1.2'}</PlainText>
            </AlignContainer>
          </Col>
          <Col md={4}>
            <PlainText size='13' color='var(--soft-white)'>ピッチ</PlainText>
            <ContainerSpacer left='10'>
              <InputRange defaultValue={config.synthesisConfig.pitch || '0'} min='-10.0' max='10.0' step='1' onChange={setPitch} />
            </ContainerSpacer>
            <AlignContainer textAlign='right'>
              <PlainText size='12' color='var(--soft-white)'>{config.synthesisConfig.pitch || '0'}</PlainText>
            </AlignContainer>
          </Col>
          <Col md={4}>
            <PlainText size='13' color='var(--soft-white)'>音量調整</PlainText>
            <ContainerSpacer left='10'>
              <InputRange defaultValue={config.synthesisConfig.volumeGainDb || '0'} min='-5.0' max='0' step='1' onChange={setVolumeGainDb} />
            </ContainerSpacer>
            <AlignContainer textAlign='right'>
              <PlainText size='12' color='var(--soft-white)'>{config.synthesisConfig.volumeGainDb || '0'}</PlainText>
            </AlignContainer>
          </Col>
        </Row>
      </GridContainer>
    </ContainerSpacer>
  )
}