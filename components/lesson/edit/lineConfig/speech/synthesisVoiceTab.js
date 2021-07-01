import React from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import FlipIconButton from '../../../../button/flipIconButton'
import Spacer from '../../../../spacer'
import InputText from '../../../../form/inputText'
import SynthesisVoiceConfig from '../../../../synthesisVoiceConfig'
import useSynthesisVoiceEditor from '../../../../../libs/hooks/lesson/edit/useSynthesisVoiceEditor'

export default function SynthesisVoiceTab({ config, dispatchConfig, switchTab }) {
  const { setSubtitle, setLanguageCode, setName, setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isSynthesizing } = useSynthesisVoiceEditor(config, dispatchConfig)

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

      <SynthesisVoiceConfig isProcessing={isSynthesizing} languageCode={config.synthesisConfig.languageCode} setLanguageCode={setLanguageCode} name={config.synthesisConfig.name} setName={setName}
        speakingRate={config.synthesisConfig.speakingRate} setSpeakingRate={setSpeakingRate} pitch={config.synthesisConfig.pitch} setPitch={setPitch}
        volumeGainDb={config.synthesisConfig.volumeGainDb} setVolumeGainDb={setVolumeGainDb} playVoice={playVoice} isDark={true} />
    </ContainerSpacer>
  )
}