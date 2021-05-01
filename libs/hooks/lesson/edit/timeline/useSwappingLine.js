export default function useSwappingLine({ lastTimeline, sortedElapsedTimes, maxDurationSecInLine, calcTime, targetMaterials, allMaterialNames }) {
  function swapLine(fromIndex, toIndex) {
    if (fromIndex === toIndex) return
    if (fromIndex === toIndex + 1) return

    const elapsedTimes = sortedElapsedTimes()
    const selfElapsedTime = elapsedTimeByIndex(elapsedTimes, fromIndex)

    let offsetTime = calcShiftTime(fromIndex, selfElapsedTime, elapsedTimes)
    if (fromIndex < toIndex) offsetTime *= -1 // 上から下に移動する場合、開始時間は減算のためoffsetTimeを負数にする

    let fromElapsedTime, toElapsedTime
    if (fromIndex < toIndex) {
      fromElapsedTime = elapsedTimeByIndex(elapsedTimes, fromIndex + 1)
      toElapsedTime = elapsedTimeByIndex(elapsedTimes, toIndex)
    } else {
      fromElapsedTime = elapsedTimeByIndex(elapsedTimes, toIndex + 1) // 下から上への移動では、移動先の直下の行からシフトしていく
      toElapsedTime = elapsedTimeByIndex(elapsedTimes, fromIndex - 1)
    }

    allMaterialNames().forEach(kind => {
      targetMaterials(kind).setter(materials => {
        materials.forEach(material => {
          if (material.elapsedTime === selfElapsedTime) {
            let newElapsedTime
            if (fromIndex < toIndex && elapsedTimeByIndex(elapsedTimes, toIndex + 1)) {
            // 移動先の直下に行があるなら、その行の開始時間から移動元の行の所要時間を引いたものを自身の開始時間とする
              const nextElapsedTime = elapsedTimeByIndex(elapsedTimes, toIndex + 1)
              newElapsedTime = calcTime(nextElapsedTime, offsetTime)
            } else if (fromIndex < toIndex) {
            // 移動先が一番下の行なら、その行の終了直後を自身のelapsedTimeとする
              const lastElapsedTime = elapsedTimeByIndex(elapsedTimes, toIndex)
              const lastDurationSec = maxDurationSecInLine(lastTimeline())
              newElapsedTime = calcTime(lastElapsedTime, lastDurationSec)
            } else  {
            // 移動先が移動元よりも上なら、移動先の直下の行のシフトする前の開始時間を移動元の開始時間とする
              newElapsedTime = elapsedTimeByIndex(elapsedTimes, toIndex + 1)
            }

            const diffTime = parseFloat((material.elapsedTime - newElapsedTime).toFixed(3))
            material.elapsedTime = newElapsedTime
            shiftDrawingElapsedTime(kind, material, diffTime)
          } else if (material.elapsedTime >= fromElapsedTime && material.elapsedTime <= toElapsedTime) {
            material.elapsedTime = calcTime(material.elapsedTime, offsetTime)
            shiftDrawingElapsedTime(kind, material, offsetTime)
          }
        })

        return [...materials]
      })
    })
  }

  function calcShiftTime(fromIndex, fromElapsedTime, elapsedTimes) {
    if (fromIndex === Object.keys(elapsedTimes).length - 1) {
      const durationSec = maxDurationSecInLine(lastTimeline())
      return durationSec > 0 ? durationSec : 1.0 // 画像の切り替えなどでdurationSecを持たないものは便宜上1秒にする
    } else {
      const nextElapsedTime = elapsedTimeByIndex(elapsedTimes, fromIndex + 1)
      // 自身の開始時間から次の開始時間までの時間を所要時間とする
      return parseFloat((nextElapsedTime - fromElapsedTime).toFixed(3))
    }
  }

  function elapsedTimeByIndex(elapsedTimes, index) {
    return parseFloat(parseFloat(elapsedTimes[index]).toFixed(3))
  }

  function shiftDrawingElapsedTime(kind, material, offsetTime) {
    if (kind === 'drawing' && material.units) {
      material.units.forEach(unit => {
        unit.elapsedTime = calcTime(unit.elapsedTime, offsetTime)
      })
    }
  }

  return { swapLine }
}