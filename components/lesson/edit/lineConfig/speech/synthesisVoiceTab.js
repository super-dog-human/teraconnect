import React from 'react'
import Flex from '../../../../flex'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import FlipIconButton from '../../../../button/flipIconButton'
import Spacer from '../../../../spacer'
import InputText from '../../../../form/inputText'
import SynthesisVoiceConfig from '../../../../synthesisVoiceConfig'
import { useLessonEditorContext } from '../../../../../libs/contexts/lessonEditorContext'
import useSynthesisVoiceEditor from '../../../../../libs/hooks/lesson/useSynthesisVoiceEditor'

export default function SynthesisVoiceTab({ config, dispatchConfig, switchTab }) {
  const { generalSetting } = useLessonEditorContext()
  const { setSubtitle, setLanguageCode, setName, setSpeakingRate, setPitch, setVolumeGainDb, playVoice, isSynthesizing } =
    useSynthesisVoiceEditor({ dispatchConfig, url: config.url, subtitle: config.subtitle, synthesisConfig: config.synthesisConfig, defaultSynthesisConfig: generalSetting.voiceSynthesisConfig })

  return (
    <ContainerSpacer left='50' right='50'>
      <Spacer height='10' />
      <Flex justifyContent='flex-end'>
        <Container width='30' height='30'>
          <FlipIconButton name='robot' flipName='microphone' backgroundColor='var(--dark-gray)' borderColor='var(--dark-gray)' padding='5' onClick={switchTab} />
        </Container>
      </Flex>
      <Spacer height='18' />
      <InputText defaultValue={config.subtitle} key={config.subtitle} size='16' color='var(--soft-white)' borderWidth='0 0 1px' borderColor='var(--text-gray)' onBlur={setSubtitle} />

      <SynthesisVoiceConfig isProcessing={isSynthesizing} synthesisConfig={config.synthesisConfig} setLanguageCode={setLanguageCode} setName={setName}
        setSpeakingRate={setSpeakingRate} setPitch={setPitch} setVolumeGainDb={setVolumeGainDb} playVoice={playVoice} isDark={true} />
    </ContainerSpacer>
  )
}