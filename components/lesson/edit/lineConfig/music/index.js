import React from 'react'
import Spacer from '../../../../spacer'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import Flex from '../../../../flex'
import FlexItem from '../../../../flexItem'
import DialogHeader from '../configDialog/dialogHeader'
import DialogFooter from '../configDialog/dialogFooter'
import InputRadio from '../../../../form/inputRadio'
import InputCheckbox from '../../../../form/inputCheckbox'
import InputRange from '../../../../form/inputRange'
import InputFile from '../../../../form/inputFile'
import Select from '../../../../form/select'
import IconButton from '../../../../button/iconButton'
import LabelButton from '../../../../button/labelButton'
import PlainText from '../../../../plainText'
import useBackgroundMusicConfig from '../../../../../libs/hooks/lesson/edit/useBackgroundMusicConfig'

export default function Music(props) {
  const { config, dispatchConfig, musicOptions, isPlaying, inputFileRef, handleFileChange, handleActionChange, handleMusicChange, handlePlayClick,
    handleVolumeChange, handleFadeChange, handleLoopChange, handleConfirm, handleCancel } = useBackgroundMusicConfig(props)

  return (
    <>
      <DialogHeader onCloseClick={handleCancel} />

      <ContainerSpacer left='50' right='50'>
        <Flex>
          <InputRadio id={'embedding-play'} name='graphicLine' size='16' color='var(--soft-white)'
            value='start' checked={config.action === 'start'} onChange={handleActionChange}>
            <PlainText size='13' lineHeight='18' color='var(--soft-white)'>再生</PlainText>
          </InputRadio>
          <Spacer width='30' />
          <InputRadio id={'embedding-stop'} name='graphicLine' size='16' color='var(--soft-white)'
            value='stop' checked={config.action === 'stop'} onChange={handleActionChange}>
            <PlainText size='13' lineHeight='18' color='var(--soft-white)'>停止</PlainText>
          </InputRadio>
        </Flex>

        <Container height='30' />

        <Flex>
          <Container width='550'>
            <Select color='var(--soft-white)' options={musicOptions} topLabel={null} value={config.backgroundMusicID} onChange={handleMusicChange} />
          </Container>
          <Spacer width='20' />
          <Container width='30' height='30'>
            <IconButton name={isPlaying ? 'pause' : 'play'} backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='8' onClick={handlePlayClick} />
          </Container>
        </Flex>

        <Spacer height='10' />
        <Container width='50'>
          <InputFile accept='audio/mpeg' onChange={handleFileChange} ref={inputFileRef} />
          <LabelButton fontSize='13' color='var(--soft-white)'>
            mp3アップロード
          </LabelButton>
        </Container>

        <Spacer height='30' />

        <Flex>
          <FlexItem column='3'>
            <InputCheckbox id='fadeInCheckbox' size='15' borderColor='var(--border-gray)' checkColor='var(--soft-white)' checked={config.isFading} onChange={handleFadeChange}>
              <PlainText size='14' color='var(--soft-white)'>フェードイン</PlainText>
            </InputCheckbox>
            <Spacer width='30' />
          </FlexItem>

          <FlexItem column='3'>
            <InputCheckbox id='loopCheckbox' size='15' borderColor='var(--border-gray)' checkColor='var(--soft-white)' checked={config.isLoop} onChange={handleLoopChange}>
              <PlainText size='14' color='var(--soft-white)'>ループ</PlainText>
            </InputCheckbox>
          </FlexItem>

          <FlexItem column='3'>
            <Flex justifyContent='right'>
              <FlexItem flex='none'>
                <Container width='100'>
                  <PlainText size='14' color='var(--soft-white)'>ボリューム</PlainText>
                </Container>
              </FlexItem>
              <FlexItem flex='1'>
                <Container width='100'>
                  <InputRange min='0.1' max='1.0' step='0.05' size='14' color='var(--soft-white)' defaultValue={config.volume} onInput={handleVolumeChange} onChange={handleVolumeChange} />
                  {config.volume}
                </Container>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>
      </ContainerSpacer>

      <Container height='40' />

      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={config.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} />
        </ContainerSpacer>
      </Container>
    </>
  )
}