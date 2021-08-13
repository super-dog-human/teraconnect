export default function useUpdatingLine({ shiftElapsedTime, nextElapsedTimeByKind, updateMaterial, targetMaterial }) {
  function updateLine({ kind, index, elapsedTime, newValue, changeAfterLineElapsedTime }) {
    const { materials, setter } = targetMaterial(kind)
    const currentValue = materials.filter(m => m.elapsedTime === elapsedTime)[index]
    const durationDiff = ['embedding', 'graphic', 'music'].includes(kind) ? 0 : newValue.durationSec - currentValue.durationSec
    const elapsedDiff = newValue.elapsedTime - currentValue.elapsedTime

    if (durationDiff + elapsedDiff === 0) {
      updateMaterial(setter, currentValue, newValue)
      return
    }

    if (elapsedDiff !== 0 && changeAfterLineElapsedTime) {
      if (elapsedDiff > 0) { // 自身を後に移動する場合、先に元の後続行を更新してから自身を更新する
        shiftElapsedTime({ fromElapsedTime: elapsedTime, offsetTime: durationDiff + elapsedDiff })
        updateMaterial(setter, currentValue, newValue)
      } else {               // 自身を前に移動する場合、自身を更新してから新しい後続行を更新する
        updateMaterial(setter, currentValue, newValue)
        shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: durationDiff + elapsedDiff })
      }
    } else {
      updateMaterial(setter, currentValue, newValue)

      if (durationDiff !== 0) {
        const nextElapsedTime = nextElapsedTimeByKind(newValue.elapsedTime, kind)
        const endTime = newValue.elapsedTime + newValue.durationSec
        if (nextElapsedTime <= endTime) { // 所要時間更新後も後続の行との時間重複があれば解消する
          shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: endTime - nextElapsedTime + 0.001 })
        } else {
          shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: durationDiff })
        }
      }
    }
  }

  return { updateLine }
}