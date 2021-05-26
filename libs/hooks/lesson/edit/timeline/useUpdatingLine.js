export default function useUpdatingLine({ shiftElapsedTime, updateMaterial, targetMaterials }) {
  function updateLine(kind, index, elapsedTime, newValue, keepAfterLineElapsedTime) {
    const { materials, setter } = targetMaterials(kind)
    const currentValue = materials.filter(m => m.elapsedTime === elapsedTime)[index]

    const durationDiff = newValue.durationSec - currentValue.durationSec
    const elapsedDiff = newValue.elapsedTime - currentValue.elapsedTime

    if (durationDiff + elapsedDiff === 0) {
      updateMaterial(setter, currentValue, newValue)
    } else if (durationDiff === 0 && keepAfterLineElapsedTime) {
      updateMaterial(setter, currentValue, newValue)
      shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: durationDiff })
    } else {
      updateMaterial(setter, currentValue, newValue)
      shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: durationDiff + elapsedDiff })
    }
  }

  return { updateLine }
}