import React, { useEffect } from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
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
import useSpeechTextEdit from '../../../../../libs/hooks/lesson/edit/useSpeechTextEdit'

export default function HumanVoiceTab({ config, setConfig, switchTab }) {
  const  { devices, requestMicPermission } = useAudioInputDevices()
  const { isMicReady, isSpeaking, micDeviceID, setMicDeviceID, voiceFile } = useVoiceRecorder(null, false)
  //  const {  } = useSpeechTextEdit(setConfig)

  useEffect(() => {
    requestMicPermission()
  }, [])

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
                  00:00 / 00:00
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
              <IconButton name='play' backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='10' />
            </Container>
          </Col>
        </Row>
        <Spacer height='30' />
        <Row>
          <Col md={11}>
            <Select options={devices} topLabel={null} color='var(--soft-white)' backgroundColor='var(--dark-gray)' />
          </Col>
          <Col md={1}>
            <Container width='35' height='35'>
              <SVGButton backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='8'>
                <RecordingIcon />
              </SVGButton>
            </Container>
          </Col>
        </Row>
      </GridContainer>
    </ContainerSpacer>
  )
}