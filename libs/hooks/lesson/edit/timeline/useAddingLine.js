export default function useAddingLine({ lessonRef, maxDurationSecInLine, lastTimeline, targetMaterials }) {

  function addAvatarLine() {
  }

  function addDrawingLine() {
  }

  function addGraphicLine() {
  }

  function addSpeechLine() {
  }

  function addSpeechLineToLast() {
    const line = lastTimeline()
    const lastElapsedTime = line[Object.keys(line)[0]][0].elapsedTime

    let durationSec = maxDurationSecInLine(line)
    if (durationSec === 0) durationSec = 1.0

    const newElapsedTime = parseFloat((lastElapsedTime + durationSec).toFixed(3))
    if (newElapsedTime > 600.0) return

    const newSpeech = {
      voiceID: '',
      elapsedTime: newElapsedTime,
      durationSec: 10.0,
      subtitle: '',
      caption: {},
      url: '',
      isSynthesis: !lessonRef.current.needsRecording,
      synthesisConfig: {},
      isFocus: true,
    }

    targetMaterials('speech').setter(speeches => {
      return [...speeches, newSpeech]
    })
    // timelineの更新はuseEffectから行う
  }

  function addMusicLine() {
  }

  return { addAvatarLine, addDrawingLine, addGraphicLine, addSpeechLine, addSpeechLineToLast, addMusicLine }
}