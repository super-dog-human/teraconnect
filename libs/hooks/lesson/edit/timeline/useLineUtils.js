export default function useLineUtils({ avatars, drawings, embeddings, graphics, musics, speeches,
  setAvatars, setDrawings, setEmbeddings, setGraphics, setSpeeches, setMusics, timeline }) {

  function shiftElapsedTime({ fromElapsedTime, offsetTime }) {
    allMaterialNames().forEach(kind => {
      targetMaterial(kind).setter(materials => {
        materials.forEach(m => {
          if (fromElapsedTime && m.elapsedTime <= fromElapsedTime) return // 対象の時間が自身以前のものはスキップ

          const newElapsedTime = calcTime(m.elapsedTime, offsetTime)
          // 変更後の時間が自身以前になってしまう場合はスキップ。通常は発生しないが、変更前の後続行の開始時間が自身の終了より前の場合に起こりうる
          if (newElapsedTime <= fromElapsedTime) return

          m.elapsedTime = newElapsedTime
          if (kind === 'drawing' && m.units) {
            m.units.forEach(unit => {
              unit.elapsedTime = calcTime(unit.elapsedTime, offsetTime)
            })
          }
        })

        return [...materials.sort((a, b) => a.elapsedTime - b.elapsedTime)]
      })
    })
  }

  function updateMaterial(setter, currentValue, newValue) {
    setter(materials => {
      const updatedMaterials = materials.map(m => (m === currentValue) ? { ...newValue } : m)
      if (currentValue.elapsedTime === newValue.elapsedTime) {
        return updatedMaterials
      } else {
        return updatedMaterials.sort((a, b) => a.elapsedTime - b.elapsedTime)
      }
    })
  }

  function deleteMaterial(setter, elapsedTime, index) {
    setter(materials => {
      let currentIndex = -1
      const targetIndex = materials.findIndex(m => {
        if (m.elapsedTime === elapsedTime) currentIndex += 1
        return (m.elapsedTime === elapsedTime && currentIndex === index)
      })
      materials.splice(targetIndex, 1)
      return [...materials]
    })
  }

  function lastTimeline() {
    const lastElapsedTime = sortedElapsedTimes().slice(-1)[0]
    return timeline[lastElapsedTime]
  }

  function sortedElapsedTimes() {
    return Object.keys(timeline).sort((a, b) => a - b)
  }

  function maxDurationSecInLine(line) {
    return Math.max(...Object.keys(line).flatMap(kind => line[kind].map(k => k.durationSec || 0)))
  }

  function nextElapsedTime(elapsedTime) {
    const time = Math.min(...allMaterials().map(materials => (
      Math.min(...materials.map(m => m.elapsedTime).filter(e => e > elapsedTime))
    )))

    return isFinite(time) ? time : null // Math.minに空配列を渡すとInifinityが返るのでnullにする
  }

  function nextElapsedTimeByKind(elapsedTime, kind) {
    return Math.min(...targetMaterial(kind).materials.map(m => m.elapsedTime).filter(e => e > elapsedTime))
  }

  function calcTime(currentValue, offsetTime) {
    return parseFloat((currentValue + offsetTime).toFixed(3))
  }

  function targetMaterial(kind) {
    switch(kind) {
    case 'avatar':
      return { materials: avatars, setter: setAvatars }
    case 'drawing':
      return { materials: drawings, setter: setDrawings }
    case 'embedding':
      return { materials: embeddings, setter: setEmbeddings }
    case 'graphic':
      return { materials: graphics, setter: setGraphics }
    case 'speech':
      return { materials: speeches, setter: setSpeeches }
    case 'music':
      return { materials: musics, setter: setMusics }
    }
  }

  function allMaterialNames() {
    return ['avatar', 'drawing', 'embedding', 'graphic', 'music', 'speech']
  }

  function allMaterials() {
    return [avatars, drawings, embeddings, graphics, musics, speeches]
  }

  return { shiftElapsedTime, updateMaterial, deleteMaterial, lastTimeline, sortedElapsedTimes, maxDurationSecInLine,
    nextElapsedTime, nextElapsedTimeByKind, calcTime, targetMaterial, allMaterialNames, allMaterials }
}