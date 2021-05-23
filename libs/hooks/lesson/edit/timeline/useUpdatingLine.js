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

    // elapsedTimeが更新されていて、なおかつ自身以降もシフトするフラグが欲しい

    // elapsedTimeがかぶっていたら配列の最後に追加する

    // kindに応じてdurationの重複チェックを実行し、timelineを更新する
  }

  return { updateLine }
}