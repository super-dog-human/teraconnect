export default function useGraphicController({ graphics, updateLine }) {
  function removeGraphic(graphicID) {

  }

  function swapGraphic(e) {
    console.log('swapGraphic...')
    // graphicsとtimlineの中のgraphicを探して新しいIDとURLに更新する
    // timelineのなか検索する
    // updateLine()
  }

  return { removeGraphic, swapGraphic }
}