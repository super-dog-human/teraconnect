import useFetch from '../../useFetch'
import { filterObject } from '../../../utils'

export default function useGraphicController({ setGraphics, setGraphicURLs }) {
  const { post } = useFetch()

  async function removeGraphic(graphicID) {
    setGraphics(graphics => graphics.filter(g => g.graphicID != graphicID))
    setGraphicURLs(urls => filterObject(urls, Object.keys(urls).filter(id => id != graphicID)))
    await post(`/graphics/${graphicID}`, null, 'DELETE')
  }

  function swapGraphic(graphicID, newFile) {
    console.log('swapGraphic...', graphicID, newFile)
    // ファイルをアップロードしてidを取得
    // graphicsの中を探して新しいIDとURLに更新
  }

  return { removeGraphic, swapGraphic }
}