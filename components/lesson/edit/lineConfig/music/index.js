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
import LoadingIndicator from '../../../../loadingIndicator'
import PlainText from '../../../../plainText'
import useMusicConfig from '../../../../../libs/hooks/lesson/edit/useMusicConfig'

export default function Music(props) {
  const { config, dispatchConfig, musicOptions, isPlaying, isProcessing, inputFileRef, handleFileOpen, handleFileChange, handleActionChange, handleMusicChange, handlePlayClick,
    handleVolumeChange, handleFadeChange, handleLoopChange, handleConfirm, handleCancel } = useMusicConfig(props)

  return (
    <>
      <DialogHeader onCloseClick={handleCancel}  />

      <ContainerSpacer left='50' right='50' bottom='40'>
        <Flex>
          <InputRadio id='embeddingPlay' name='graphicLine' size='16' color='var(--soft-white)'
            value='start' checked={config.action === 'start'} disabled={isProcessing} onChange={handleActionChange}>
            <PlainText size='13' lineHeight='18' color='var(--soft-white)'>再生</PlainText>
          </InputRadio>
          <Spacer width='30' />
          <InputRadio id='embeddingStop' name='graphicLine' size='16' color='var(--soft-white)'
            value='stop' checked={config.action === 'stop'} disabled={isProcessing} onChange={handleActionChange}>
            <PlainText size='13' lineHeight='18' color='var(--soft-white)'>停止</PlainText>
          </InputRadio>
        </Flex>

        <Container height='100'>
          {config.action === 'start' &&
            <>
              <Spacer height='30' />
              <Flex>
                <Container width='550'>
                  <Select color='var(--soft-white)' options={musicOptions} topLabel={null} value={config.backgroundMusicID} onChange={handleMusicChange} />
                </Container>
                <Spacer width='20' />
                <Container width='30' height='30'>
                  <IconButton name={isPlaying ? 'pause' : 'play'} backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='8' onClick={handlePlayClick} />
                </Container>
                <Spacer width='10' />
                <Container width='30' height='30'>
                  <InputFile accept='audio/mpeg' onChange={handleFileChange} ref={inputFileRef} />
                  {!isProcessing && <IconButton name='upload' backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='7' onClick={handleFileOpen} disabled={isProcessing} />}
                  {isProcessing && <LoadingIndicator size='50' color='white' />}
                </Container>
              </Flex>
              <Spacer height='20' />
              <Flex>
                <FlexItem column='2'>
                  <Flex>
                    <Spacer width='10' />
                    <InputCheckbox id='fadeInCheckbox' size='15' borderColor='var(--border-gray)' checkColor='var(--soft-white)' checked={config.isFading} onChange={handleFadeChange}>
                      <PlainText size='13' color='var(--soft-white)'>フェードイン</PlainText>
                    </InputCheckbox>
                    <Spacer width='40' />
                    <InputCheckbox id='loopCheckbox' size='15' borderColor='var(--border-gray)' checkColor='var(--soft-white)' checked={config.isLoop} onChange={handleLoopChange}>
                      <PlainText size='13' color='var(--soft-white)'>ループ</PlainText>
                    </InputCheckbox>
                  </Flex>
                </FlexItem>
                <FlexItem column='2'>
                  <Container>
                    <Flex justifyContent='flex-end' alignItems='center'>
                      <PlainText size='13' lineHeight='24' color='var(--soft-white)'>ボリューム</PlainText>
                      <Spacer width='20' />
                      <Container width='100'>
                        <Flex alignItems='center'>
                          <InputRange min='0.1' max='1.0' step='0.05' size='14' color='var(--soft-white)' defaultValue={config.volume} onChange={handleVolumeChange} />
                        </Flex>
                      </Container>
                      <Spacer width='5' />
                      <Container width='10'>
                        <PlainText size='13' lineHeight='24' color='var(--soft-white)'>{config.volume}</PlainText>
                      </Container>
                      <Spacer width='10' />
                    </Flex>
                  </Container>
                </FlexItem>
              </Flex>
            </>
          }

          {config.action === 'stop' &&
            <ContainerSpacer left='10' right='10'>
              <Spacer height='30' />
              <InputCheckbox id='fadeInCheckbox' size='15' borderColor='var(--border-gray)' checkColor='var(--soft-white)' checked={config.isFading} onChange={handleFadeChange}>
                <PlainText size='13' color='var(--soft-white)'>フェードアウト</PlainText>
              </InputCheckbox>
            </ContainerSpacer>
          }
        </Container>
      </ContainerSpacer>

      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={config.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} disabled={isProcessing} />
        </ContainerSpacer>
      </Container>
    </>
  )
}