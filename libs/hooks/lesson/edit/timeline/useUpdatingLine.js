export default function useUpdatingLine({ shiftElapsedTime, updateMaterial, targetMaterials }) {
  function updateLine({ kind, index, elapsedTime, newValue, changeAfterLineElapsedTime }) {
    const { materials, setter } = targetMaterials(kind)
    const currentValue = materials.filter(m => m.elapsedTime === elapsedTime)[index]
    updateMaterial(setter, currentValue, newValue)

    const durationDiff = newValue.durationSec - currentValue.durationSec
    const elapsedDiff = newValue.elapsedTime - currentValue.elapsedTime

    if (durationDiff + elapsedDiff === 0) return

    if (elapsedDiff !== 0 && changeAfterLineElapsedTime) {
      shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: durationDiff + elapsedDiff })
    } else if (durationDiff !== 0) {
      shiftElapsedTime({ fromElapsedTime: newValue.elapsedTime, offsetTime: durationDiff })
    }
  }

  return { updateLine }
}