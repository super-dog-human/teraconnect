export default function useDeletionLine({ shiftElapsedTime, nextElapsedTime, deleteMaterial, targetMaterials, allMaterialNames }) {
  function deleteLine(kind, index, elapsedTime) {
    const { materials, setter } = targetMaterials(kind)

    if (materials.filter(m => m.elapsedTime === elapsedTime).length > 1) {
      // 自身と同じmaterialの同じ時間に他の行が存在する場合、単純に自身だけを削除
      deleteMaterial(setter, elapsedTime, index)
      return
    } else if (includesElapsedTimeInAllMaterial(elapsedTime, materials)) {
      // 自身とは異なるmterialの同じ時間に他の行が存在する場合、単純に自身だけを削除
      deleteMaterial(setter, elapsedTime, index)
      return
    }

    const nextTime = nextElapsedTime(elapsedTime)
    if (!nextTime) {
      // 自身の後に行が存在しなければ、単純に自身だけを削除
      deleteMaterial(setter, elapsedTime, index)
    } else {
      // 同じ時間でどのmaterialsにも行がなく、それ以降に行が存在する場合、削除した分のoffsetが発生する
      deleteMaterial(setter, elapsedTime, index)
      const offsetTime = parseFloat((elapsedTime - nextTime).toFixed(3))
      shiftElapsedTime({ fromElapsedTime: elapsedTime, offsetTime })
    }
  }

  function includesElapsedTimeInAllMaterial(elapsedTime, skipMaterial) {
    return allMaterialNames().filter(m => m !== skipMaterial).some(kind => {
      const { materials } = targetMaterials(kind)
      return includesElapsedTime(elapsedTime, materials)
    })
  }

  function includesElapsedTime(elapsedTime, materials) {
    return materials.some(m => m.elapsedTime === elapsedTime)
  }

  return { deleteLine }
}