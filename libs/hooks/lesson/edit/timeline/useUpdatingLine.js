export default function useUpdatingLine({ shiftElapsedTime, nextElapsedTimeByKind, updateMaterial, targetMaterial }) {
  function updateLine({ kind, index, elapsedTime, newValue, changeAfterLineElapsedTime }) {
    const { materials, setter } = targetMaterial(kind)
    const currentValue = materials.filter(m => m.elapsedTime === elapsedTime)[index]
    updateMaterial(setter, currentValue, newValue)

    const durationDiff = ['embedding', 'graphic', 'music'].includes(kind) ? 0 : newValue.durationSec - currentValue.durationSec
    const elapsedDiff = newValue.elapsedTime - currentValue.elapsedTime

    if (durationDiff + elapsedDiff === 0) return

    if (elapsedDiff !== 0 && changeAfterLineElapsedTime) {
      shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: durationDiff + elapsedDiff })
    } else if (durationDiff !== 0) {
      const nextElapsedTime = nextElapsedTimeByKind(newValue.elapsedTime, kind)
      const endTime = newValue.elapsedTime + newValue.durationSec
      if (nextElapsedTime <= endTime) { // 後続の行との時間重複があれば解消する
        shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: endTime - nextElapsedTime + 0.001 })
      } else {
        shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: durationDiff })
      }
    }
  }

  return { updateLine }
}