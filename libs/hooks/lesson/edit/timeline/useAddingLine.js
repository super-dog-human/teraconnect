export default function useAddingLine({ lessonRef, maxDurationSecInLine, lastTimeline, targetMaterials }) {

  function addAvatarLine(elapsedTime) {
    const avatar = {
      durationSec: 0,
      moving: { x: 0, y: 0, z: 0 },
    }
    addLine(elapsedTime, 'avatar', avatar)
  }

  function addDrawingLine(elapsedTime) {
    const drawing = {
      durationSec: 0,
      action: 'draw',
      units: [],
    }
    addLine(elapsedTime, 'drawing', drawing)
  }

  function addEmbedding(elapsedTime) {
    const embedding = {
      action: 'show',
      type: 'YouTube',
      resourceID: '',
    }
    addLine(elapsedTime, 'embedding', embedding)
  }

  function addGraphicLine(elapsedTime) {
    const graphic = {
      action: 'show',
    }
    addLine(elapsedTime, 'graphic', graphic)
  }

  function addSpeechLine(elapsedTime) {
    const speech = {
      voiceID: '',
      durationSec: 10.0,
      subtitle: '',
      caption: {},
      url: '',
      isSynthesis: !lessonRef.current.needsRecording,
      synthesisConfig: {},
      isFocus: true,
    }
    addLine(elapsedTime, 'speech', speech)
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

    targetMaterials('speech').setter(speeches => [...speeches, newSpeech])
  }

  function addMusicLine(elapsedTime) {
    const music = {
      action: 'start',
    }
    addLine(elapsedTime, 'music', music)
  }

  function addLine(elapsedTime, kind, newLine) {
    const nextElapsedTime = Math.floor(elapsedTime + 1.0)
    newLine.elapsedTime = nextElapsedTime
    newLine.isPending = true

    targetMaterials(kind).setter(materials => {
      const sameTimeIndex = materials.reverse().findIndex(m => m.elapsedTime === newLine.elapsedTime)
      if (sameTimeIndex >= 0) {
        materials.splice(sameTimeIndex, 0, newLine) // 同じ時間帯があればその一番最後に要素を追加する
      } else {
        const nextTimeIndex = materials.findIndex(a => a.elapsedTime > newLine.elapsedTime)
        if (nextTimeIndex >= 0) {
          materials.splice(nextTimeIndex, 0, newLine)
        } else {
          materials.push(newLine)
        }
      }

      return [...materials]
    })

  }

  return { addAvatarLine, addDrawingLine, addEmbedding, addGraphicLine, addSpeechLine, addSpeechLineToLast, addMusicLine }
}