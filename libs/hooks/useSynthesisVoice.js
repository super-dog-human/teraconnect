import { useLessonEditorContext } from '../contexts/lessonEditorContext'
import { post } from '../fetch'

export default function useSynthesisVoice() {
  const { voiceSynthesisConfig } = useLessonEditorContext()

  function createSynthesisVoiceFile(lessonID, speech) {
    const request = {
      'lessonID': lessonID,
      'text': speech.subtitle,
      'languageCode': speech.synthesisConfig?.languageCode || voiceSynthesisConfig.languageCode,
      'name': speech.synthesisConfig?.name || voiceSynthesisConfig.name,
      'speakingRate': parseFloat(speech.synthesisConfig?.speakingRate) || voiceSynthesisConfig.speakingRate,
      'pitch': parseFloat(speech.synthesisConfig?.pitch) || voiceSynthesisConfig.pitch,
      'volumeGainDb': parseFloat(speech.synthesisConfig?.volumeGainDb) || voiceSynthesisConfig.volumeGainDb,
    }

    return post('/synthesis_voice', request)
      .then(result => result)
      .catch(e  => {
        console.error(e)
      })
  }

  return { createSynthesisVoiceFile }
}