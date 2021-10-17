import useFetch from './useFetch'

export default function useSynthesisVoice(defaultConfig) {
  const { post } = useFetch()

  function createSynthesisVoiceFile({ lessonID, subtitle, synthesisConfig }) {
    const pitch = parseFloat(synthesisConfig?.pitch)
    const volume = parseFloat(synthesisConfig?.volumeGainDb)
    const request = {
      'lessonID': lessonID,
      'text': subtitle,
      'languageCode': synthesisConfig?.languageCode || defaultConfig.languageCode,
      'name': synthesisConfig?.name || defaultConfig.name,
      'speakingRate': parseFloat(synthesisConfig?.speakingRate) || defaultConfig.speakingRate,
      'pitch': isNaN(pitch) ? defaultConfig.pitch : pitch,                 // 0になりうる値は偽として評価されてしまうのでisNaNでチェック
      'volumeGainDb': isNaN(volume) ? defaultConfig.volumeGainDb : volume, // 同上
    }

    return post('/synthesis_voice', request)
      .then(result => result)
      .catch(e  => {
        console.error(e)
      })
  }

  return { createSynthesisVoiceFile }
}