export default function useAddingLine({ lessonRef, durationSec, targetMaterial }) {
  function addAvatarLine(elapsedTime) {
    const avatar = {
      durationSec: 0,
      positions: null, // 初期位置がない場合はアバターのデフォルト位置を使用するのでnullでよい
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
    let elapsedTime = Math.ceil(durationSec) // 収録の総時間を繰り上げしたものを自身の開始時間とする
    if (elapsedTime === durationSec) {
      elapsedTime += 1.0
    }

    if (elapsedTime > 600.0) return
    const newSpeech = newBlankSpeech(elapsedTime)
    targetMaterial('speech').setter(speeches => [...speeches, newSpeech])
  }

  function newBlankSpeech(elapsedTime) {
    return {
      voiceID: 0,
      elapsedTime,
      durationSec: 0,
      subtitle: '',
      caption: {},
      isSynthesis: !lessonRef.current.needsRecording,
      synthesisConfig: {},
    }
  }

  function addMusicLine(elapsedTime) {
    const music = {
      action: 'start',
      isFading: false,
      isLoop: true,
      volume: 1,
    }
    return addNewLine(elapsedTime, 'music', music)
  }

  function addNewLine(elapsedTime, kind, newLine) {
    const nextElapsedTime = parseFloat((elapsedTime + 0.001).toFixed(3))
    newLine.elapsedTime = nextElapsedTime

    let sameTimeIndex
    targetMaterial(kind).setter(materials => {
      const sameTimeLastIndex = materials.slice().reverse().findIndex(m => m.elapsedTime === newLine.elapsedTime)
      if (sameTimeLastIndex >= 0) {
        sameTimeIndex = materials.filter(m => m.elapsedTime === newLine.elapsedTime).length
        const addingIndex = materials.length - sameTimeLastIndex
        materials.splice(addingIndex, 0, newLine) // 同じ時間帯があればその一番最後に要素を追加する
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