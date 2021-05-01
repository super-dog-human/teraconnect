export default function useUpdatingLine({ shiftElapsedTime, updateMaterial, targetMaterials }) {
  function updateLine(kind, index, elapsedTime, newValue) {
    const { materials, setter } = targetMaterials(kind)
    const currentValue = materials.filter(m => m.elapsedTime === elapsedTime)[index]

    if (currentValue.durationSec === newValue.durationSec) {
      updateMaterial(setter, currentValue, newValue)
    } else {
      updateMaterial(setter, currentValue, newValue)
      // durationが変わっていたら自身以降の全てのelapsedTimeを更新しなければならない
      const offsetTime = newValue.durationSec - currentValue.durationSec
      shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, skipKind: kind, offsetTime })
    }
  }

  return { updateLine }
}