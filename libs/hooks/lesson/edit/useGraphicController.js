export default function useGraphicController({ graphics, updateLine }) {
  function removeGraphic(graphicID) {
    console.log('removeGraphic...', graphicID)
  }

  function swapGraphic(graphicID, newFile) {
    console.log('swapGraphic...', graphicID, newFile)
    // ファイルをアップロードしてidを取得
    // graphicsの中を探して新しいIDとURLに更新
  }

  return { removeGraphic, swapGraphic }
}