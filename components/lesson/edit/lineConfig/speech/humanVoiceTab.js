import React, { useRef } from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import PlainText from '../../../../plainText'
import FlipIconButton from '../../../../button/flipIconButton'
import IconButton from '../../../../button/iconButton'
import SVGButton from '../../../../button/svgButton'
import Spacer from '../../../../spacer'
import InputFile from '../../../../form/inputFile'
import InputRange from '../../../../form/inputRange'
import Select from '../../../../form/select'
import RecordingIcon from '../../../../recordingIcon'
import PlayButton from './playButton'
import { Container as GridContainer, Row, Col } from 'react-grid-system'
import useHumanVoicePlayer from '../../../../../libs/hooks/lesson/edit/useHumanVoicePlayer'
import useHumanVoiceRecorder from '../../../../../libs/hooks/lesson/edit/useHumanVoiceRecorder'
import useHumanVoiceFileController from '../../../../../libs/hooks/lesson/edit/useHumanVoiceFileController'

export default function HumanVoiceTab({ config, setConfig, switchTab }) {
  const inputFileRef = useRef(null)
  const { audioElapsedTime, audioMax, audioCurrent, isPlaying, handlePlay, handleSeek } = useHumanVoicePlayer(config)
  const { deviceOptions, isMicReady, isRecording, handleMicChange, handleRecording } = useHumanVoiceRecorder(config, setConfig)
  const { handleMoreButtonClick, handleFileChange } = useHumanVoiceFileController(config, setConfig, inputFileRef)

  return (
    <ContainerSpacer left='50' right='50'>
      <InputFile accept='audio/mpeg' onChange={handleFileChange} ref={inputFileRef} />
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
                <Container height='30'>
                  <InputRange key={audioCurrent} defaultValue={audioCurrent} min='0' max={audioMax} step='0.01' disabled={isRecording} onInput={handleSeek} onChange={handleSeek} />
                  <AlignContainer textAlign='right'>
                    <Container height='14'>
                      <PlainText size='14' color='var(--soft-white)'>{audioElapsedTime}</PlainText>
                    </Container>
                  </AlignContainer>
                </Container>
              </Col>
              <Col md={1}>
                <Spacer width='10' />
                <Container width='20' height='38'>
                  <IconButton name='more' backgroundColor='var(--dark-gray)' borderColor='var(--dark-gray)' onClick={handleMoreButtonClick} />
                </Container>
              </Col>
            </Row>
          </Col>
          <Col md={1}>
            <Container width='35' height='35'>
              <PlayButton isPlaying={isPlaying} onClick={handlePlay} disabled={!config.url || isRecording} />
            </Container>
          </Col>
        </Row>
        <Spacer height='30' />
        <Row>
          <Col md={11}>
            <Select options={deviceOptions} topLabel={null} color='var(--soft-white)' backgroundColor='var(--dark-gray)' disabled={isRecording} onChange={handleMicChange} />
          </Col>
          <Col md={1}>
            <Container width='35' height='35'>
              <SVGButton backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='8' disabled={!isMicReady} onClick={handleRecording}>
                <RecordingIcon isRecording={isRecording} />
              </SVGButton>
            </Container>
          </Col>
        </Row>
      </GridContainer>
    </ContainerSpacer>
  )
}