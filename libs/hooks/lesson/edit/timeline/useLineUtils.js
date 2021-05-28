export default function useLineUtils({ avatars, drawings, embeddings, graphics, musics, speeches,
  setAvatars, setDrawings, setEmbeddings, setGraphics, setSpeeches, setMusics, timeline }) {

  function shiftElapsedTime({ fromElapsedTime, toElapsedTime, offsetTime }) {
    allMaterialNames().forEach(kind => {
      targetMaterials(kind).setter(materials => {
        materials.forEach(m => {
          if (fromElapsedTime && m.elapsedTime <= fromElapsedTime) return // fromElapsedTimeと同じ時間まではスキップ
          if (toElapsedTime   && m.elapsedTime > toElapsedTime)   return
          m.elapsedTime = calcTime(m.elapsedTime, offsetTime)
          if (kind === 'drawing' && m.units) {
            m.units.forEach(unit => {
              unit.elapsedTime = calcTime(unit.elapsedTime, offsetTime)
            })
          }
        })
        return [...materials]
      })
    })
  }

  function updateMaterial(setter, currentValue, newValue) {
    setter(materials => (
      materials.map(m => (m === currentValue) ? { ...newValue } : m)
    ))
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

  function calcTime(currentValue, offsetTime) {
    return parseFloat((currentValue + offsetTime).toFixed(3))
  }

  function targetMaterials(kind) {
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
    nextElapsedTime, calcTime, targetMaterials, allMaterialNames, allMaterials }
}