import React, { useEffect, useState } from 'react'
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

export default function SynthesisVoiceConfig({ isProcessing, synthesisConfig, setLanguageCode, setName, setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isDark }) {
  const [voiceNames, setVoiceNames] = useState([])
  const textColor = isDark ? 'var(--soft-white)' : 'gray'
  const backgroundColor = isDark ? 'var(--dark-gray)' : ''
  const borderColor = isDark ? 'var(--border-dark-gray)' : 'gray'

  function handleLanguageCodeChange(e) {
    const languageCode = e.target.value
    setVoiceNamesByLanguage(languageCode)

    // 言語を変更した際、声も選択肢の最初のものにリセットする
    if (languageCode === SYNTHESIS_VOICE_LANGUAGE_NAMES[0].value) {
      setLanguageCode(languageCode, SYNTHESIS_JAPANESE_VOICE_NAMES[0].value)
    } else {
      setLanguageCode(languageCode, SYNTHESIS_ENGLISH_VOICE_NAMES[0].value)
    }
  }

  function setVoiceNamesByLanguage(languageCode) {
    if (languageCode === SYNTHESIS_VOICE_LANGUAGE_NAMES[0].value) {
      setVoiceNames(SYNTHESIS_JAPANESE_VOICE_NAMES)
    } else {
      setVoiceNames(SYNTHESIS_ENGLISH_VOICE_NAMES)
    }
  }

  useEffect(() => {
    if (voiceNames.length > 0) return
    if (!synthesisConfig.languageCode) return
    setVoiceNamesByLanguage(synthesisConfig.languageCode)
  }, [voiceNames.length, synthesisConfig.languageCode])

  return (
    <GridContainer>
      <Spacer height='40' />
      <Row>
        <Col md={4}>
          <Select size='14' options={SYNTHESIS_VOICE_LANGUAGE_NAMES} topLabel={null} value={synthesisConfig.languageCode} color={textColor} backgroundColor={backgroundColor} onChange={handleLanguageCodeChange} />
        </Col>
        <Col md={4}>
          <Select size='14' options={voiceNames} topLabel={null} value={synthesisConfig.name} color={textColor} backgroundColor={backgroundColor} onChange={setName} />
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
            <InputRange color={textColor} defaultValue={synthesisConfig.speakingRate} min='0.5' max='3.0' step='0.1' onChange={setSpeakingRate} />
          </ContainerSpacer>
          <AlignContainer textAlign='right'>
            <PlainText size='12' color={textColor}>{synthesisConfig.speakingRate}</PlainText>
          </AlignContainer>
        </Col>
        <Col md={4}>
          <PlainText size='13' color={textColor}>ピッチ</PlainText>
          <ContainerSpacer left='10'>
            <InputRange color={textColor} defaultValue={synthesisConfig.pitch} min='-10.0' max='10.0' step='1' onChange={setPitch} />
          </ContainerSpacer>
          <AlignContainer textAlign='right'>
            <PlainText size='12' color={textColor}>{synthesisConfig.pitch}</PlainText>
          </AlignContainer>
        </Col>
        <Col md={4}>
          <PlainText size='13' color={textColor}>音量調整</PlainText>
          <ContainerSpacer left='10'>
            <InputRange color={textColor} defaultValue={synthesisConfig.volumeGainDb} min='-5.0' max='0' step='1' onChange={setVolumeGainDb} />
          </ContainerSpacer>
          <AlignContainer textAlign='right'>
            <PlainText size='12' color={textColor}>{synthesisConfig.volumeGainDb}</PlainText>
          </AlignContainer>
        </Col>
      </Row>
    </GridContainer>
  )
}