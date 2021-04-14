import React, { useState, useEffect } from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import PlainText from '../../../../plainText'
import FlipIconButton from '../../../../button/flipIconButton'
import IconButton from '../../../../button/iconButton'
import SVGButton from '../../../../button/svgButton'
import Spacer from '../../../../spacer'
import InputRange from '../../../../form/inputRange'
import Select from '../../../../form/select'
import RecordingIcon from '../../../../recordingIcon'
import { Container as GridContainer, Row, Col } from 'react-grid-system'
import useAudioInputDevices from '../../../../../libs/hooks/useAudioInputDevices'
import useVoiceRecorder from '../../../../../libs/hooks/lesson/useVoiceRecorder'
import useAudioPlayer from '../../../../../libs/hooks/useAudioPlayer'

export default function HumanVoiceTab({ config, setConfig, switchTab }) {
  const [isRecording, setIsRecording] = useState(false)
  const  { deviceOptions, requestMicPermission } = useAudioInputDevices()
  const { isMicReady, micDeviceID, setMicDeviceID, voiceFile } = useVoiceRecorder({ needsUpload: false, isRecording })
  const { isPlaying, createAudio, switchAudio } = useAudioPlayer()

  function handleRecording() {
    setIsRecording(status => !status)
  }

  function handleMicChange(e) {
    setMicDeviceID(e.target.value)
  }

  function handleAudioPlay() {
    switchAudio()
  }

  useEffect(() => {
    requestMicPermission()

    if (config.url) createAudio(config.audio)
  }, [])

  useEffect(() => {
    if (deviceOptions.length === 0) return

    setMicDeviceID(deviceOptions[0].value)
  }, [deviceOptions])

  useEffect(() => {
    if (!voiceFile) return

    const url = URL.createObjectURL(voiceFile)
    setConfig(config => {
      config.url = url
      return { ...config }
    })
    createAudio(url)
  }, [voiceFile])

  return (
    <ContainerSpacer left='50' right='50'>
      <Spacer height='10' />
      <Flex justifyContent='flex-end'>
        <Container width='30' height='30'>
          <FlipIconButton name='microphone' flipName='robot' backgroundColor='var(--dark-gray)' borderColor='var(--dark-gray)' padding='5' onClick={switchTab} />
        </Container>
      </Flex>
      <Spacer height='30' />
      <GridContainer>
        <Row>
          <Col md={11}>
            <Row>
              <Col md={11}>
                <InputRange value='0' max='0' step='0.1'/>
                <AlignContainer textAlign='right'>
                  <PlainText color='var(--soft-white)'>00:00 / 00:00</PlainText>
                </AlignContainer>
              </Col>
              <Col md={1}>
                <Spacer width='10' />
                <Container width='20'>
                  <IconButton name='more' backgroundColor='var(--dark-gray)' borderColor='var(--dark-gray)' />
                </Container>
              </Col>
            </Row>
          </Col>
          <Col md={1}>
            <Container width='35' height='35'>
              <IconButton name='play' backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='10' onClick={handleAudioPlay} disabled={!config.url || isRecording} />
            </Container>
          </Col>
        </Row>
        <Spacer height='30' />
        <Row>
          <Col md={11}>
            <Select options={deviceOptions} topLabel={null} value={micDeviceID} color='var(--soft-white)' backgroundColor='var(--dark-gray)' disabled={isRecording} onChange={handleMicChange} />
          </Col>
          <Col md={1}>
            <Container width='35' height='35'>
              <SVGButton backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='8' disabled={!isMicReady} onClick={handleRecording}>
                <RecordingIcon />
              </SVGButton>
            </Container>
          </Col>
        </Row>
      </GridContainer>
    </ContainerSpacer>
  )
}