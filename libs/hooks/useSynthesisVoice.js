import useFetch from './useFetch'

export default function useSynthesisVoice(voiceSynthesisConfig) {
  const { post } = useFetch()

  function createSynthesisVoiceFile({ lessonID, subtitle, synthesisConfig }) {
    const pitch = parseFloat(synthesisConfig?.pitch)
    const volume = parseFloat(synthesisConfig?.volumeGainDb)
    const request = {
      'lessonID': lessonID,
      'text': subtitle,
      'languageCode': synthesisConfig?.languageCode || voiceSynthesisConfig.languageCode,
      'name': synthesisConfig?.name || voiceSynthesisConfig.name,
      'speakingRate': parseFloat(synthesisConfig?.speakingRate) || voiceSynthesisConfig.speakingRate,
      'pitch': isNaN(pitch) ? voiceSynthesisConfig.pitch : pitch,                 // 0になりうる値は偽として評価されてしまうのでisNaNでチェック
      'volumeGainDb': isNaN(volume) ? voiceSynthesisConfig.volumeGainDb : volume, // 同上
    }

    return post('/synthesis_voice', request)
      .then(result => result)
      .catch(e  => {
        console.error(e)
      })
  }

  return { createSynthesisVoiceFile }
}