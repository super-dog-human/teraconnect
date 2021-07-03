import React, { useState } from 'react'
import { Container as GridContainer, Row, Col } from 'react-grid-system'
import Spacer from './spacer'
import Container from './container'
import ContainerSpacer from './containerSpacer'
import AlignContainer from './alignContainer'
import IconButton from './button/iconButton'
import Select from './form/select'
import InputRange from './form/inputRange'
import PlainText from './plainText'
import { SYNTHESIS_VOICE_LANGUAGE_NAMES, SYNTHESIS_JAPANESE_VOICE_NAMES, SYNTHESIS_ENGLISH_VOICE_NAMES } from '../libs/constants'

export default function SynthesisVoiceConfig({ isProcessing, languageCode, setLanguageCode, name, setName, speakingRate, setSpeakingRate, pitch, setPitch, volumeGainDb, setVolumeGainDb, playVoice, isDark }) {
  const [voiceNames, setVoiceNames] = useState(SYNTHESIS_JAPANESE_VOICE_NAMES)
  const textColor = isDark ? 'var(--soft-white)' : 'gray'
  const backgroundColor = isDark ? 'var(--dark-gray)' : ''
  const borderColor = isDark ? 'var(--border-dark-gray)' : 'gray'

  function handleLanguageCodeChange(e) {
    const languageCode = e.target.value
    let newVoiceName // 言語を変更した際、声も選択肢の最初のものにリセットする
    if (languageCode === SYNTHESIS_VOICE_LANGUAGE_NAMES[0].value) {
      setVoiceNames(SYNTHESIS_JAPANESE_VOICE_NAMES)
      newVoiceName = SYNTHESIS_JAPANESE_VOICE_NAMES[0].value
    } else {
      setVoiceNames(SYNTHESIS_ENGLISH_VOICE_NAMES)
      newVoiceName = SYNTHESIS_ENGLISH_VOICE_NAMES[0].value
    }

    setLanguageCode(languageCode, newVoiceName)
  }

  return (
    <GridContainer>
      <Spacer height='40' />
      <Row>
        <Col md={4}>
          <Select options={SYNTHESIS_VOICE_LANGUAGE_NAMES} topLabel={null} value={languageCode} color={textColor} backgroundColor={backgroundColor} onChange={handleLanguageCodeChange} />
        </Col>
        <Col md={4}>
          <Select options={voiceNames} topLabel={null} value={name} color={textColor} backgroundColor={backgroundColor} onChange={setName} />
        </Col>
        <Col md={3}></Col>
        <Col md={1}>
          <Container width='35' height='35'>
            <IconButton name={isDark ? 'play' : 'play-gray'} backgroundColor={backgroundColor} borderColor={borderColor} padding='10' onClick={playVoice} isProcessing={isProcessing} />
          </Container>
        </Col>
      </Row>
      <Spacer height='30' />
      <Row>
        <Col md={4}>
          <PlainText size='13' color={textColor}>速度</PlainText>
          <ContainerSpacer left='10'>
            <InputRange color={textColor} defaultValue={speakingRate || '1.2'} min='0.5' max='3.0' step='0.1' onInput={setSpeakingRate} onChange={setSpeakingRate} />
          </ContainerSpacer>
          <AlignContainer textAlign='right'>
            <PlainText size='12' color={textColor}>{speakingRate || '1.2'}</PlainText>
          </AlignContainer>
        </Col>
        <Col md={4}>
          <PlainText size='13' color={textColor}>ピッチ</PlainText>
          <ContainerSpacer left='10'>
            <InputRange color={textColor} defaultValue={pitch || '0'} min='-10.0' max='10.0' step='1' onInput={setPitch} onChange={setPitch} />
          </ContainerSpacer>
          <AlignContainer textAlign='right'>
            <PlainText size='12' color={textColor}>{pitch || '0'}</PlainText>
          </AlignContainer>
        </Col>
        <Col md={4}>
          <PlainText size='13' color={textColor}>音量調整</PlainText>
          <ContainerSpacer left='10'>
            <InputRange color={textColor} defaultValue={volumeGainDb || '0'} min='-5.0' max='0' step='1' onInput={setVolumeGainDb} onChange={setVolumeGainDb} />
          </ContainerSpacer>
          <AlignContainer textAlign='right'>
            <PlainText size='12' color={textColor}>{volumeGainDb || '0'}</PlainText>
          </AlignContainer>
        </Col>
      </Row>
    </GridContainer>
  )
}