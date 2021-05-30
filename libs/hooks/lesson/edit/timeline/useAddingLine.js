export default function useAddingLine({ lessonRef, maxDurationSecInLine, lastTimeline, targetMaterials }) {
  function addAvatarLine(elapsedTime) {
    const avatar = {
      durationSec: 0,
      moving: { x: 0, y: 0, z: 0 },
    }
    return addNewLine(elapsedTime, 'avatar', avatar)
  }

  function addDrawingLine(elapsedTime) {
    const drawing = {
      durationSec: 0,
      action: 'draw',
      units: [],
    }
    return addNewLine(elapsedTime, 'drawing', drawing)
  }

  function addEmbeddingLine(elapsedTime) {
    const embedding = {
      action: 'show',
      serviceName: 'youtube',
      contentID: '',
    }
    return addNewLine(elapsedTime, 'embedding', embedding)
  }

  function addGraphicLine(elapsedTime) {
    const graphic = {
      action: 'show',
    }
    return addNewLine(elapsedTime, 'graphic', graphic)
  }

  function addSpeechLine(elapsedTime) {
    const speech = newBlankSpeech(elapsedTime)
    return addNewLine(elapsedTime, 'speech', speech)
  }

  function addSpeechLineToLast() {
    const line = lastTimeline()
    const lastElapsedTime = line[Object.keys(line)[0]][0].elapsedTime

    let durationSec = maxDurationSecInLine(line)
    if (durationSec === 0) durationSec = 1.0

    const newElapsedTime = parseFloat((lastElapsedTime + durationSec).toFixed(3))
    if (newElapsedTime > 600.0) return

    const newSpeech = newBlankSpeech(newElapsedTime)
    targetMaterials('speech').setter(speeches => [...speeches, newSpeech])
  }

  function newBlankSpeech(elapsedTime) {
    return {
      voiceID: '',
      elapsedTime,
      durationSec: 0,
      subtitle: '',
      caption: {},
      url: '',
      isSynthesis: !lessonRef.current.needsRecording,
      synthesisConfig: {},
      isFocus: true,
    }
  }

  function addMusicLine(elapsedTime) {
    const music = {
      action: 'start',
    }
    return addNewLine(elapsedTime, 'music', music)
  }

  function addNewLine(elapsedTime, kind, newLine) {
    const nextElapsedTime = Math.floor(elapsedTime + 1.0)
    newLine.elapsedTime = nextElapsedTime

    let sameTimeIndex
    targetMaterials(kind).setter(materials => {
      const sameTimeLastIndex = materials.slice().reverse().findIndex(m => m.elapsedTime === newLine.elapsedTime)
      if (sameTimeLastIndex >= 0) {
        sameTimeIndex = materials.length - sameTimeLastIndex
        materials.splice(sameTimeIndex, 0, newLine) // 同じ時間帯があればその一番最後に要素を追加する
      } else {
        sameTimeIndex = 0
        const nextTimeIndex = materials.findIndex(a => a.elapsedTime > newLine.elapsedTime)
        if (nextTimeIndex >= 0) {
          materials.splice(nextTimeIndex, 0, newLine)
        } else {
          materials.push(newLine)
        }
      }

      return [...materials]
    })

    return { index: sameTimeIndex, newLine }
  }

  return { addAvatarLine, addDrawingLine, addEmbeddingLine, addGraphicLine, addSpeechLine, addSpeechLineToLast, addMusicLine }
}