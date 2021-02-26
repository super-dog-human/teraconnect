import { useState, useEffect } from 'react'
import { useErrorDialogContext } from '../../../contexts/errorDialogContext'
import { fetchGraphicURLs }  from '../../../lessonEdit'

export default function useGraphicController({ lessonID, graphics, setGraphics, timeline, updateLine }) {
  const [finishedGraphicSetting, setFinishedGraphicSetting] = useState(false)
  const [graphicURL, setGraphicURL] = useState({})
  const { showError } = useErrorDialogContext()

  function setURLToGraphics() {
    const graphicsWithURL = [...graphics]
    graphics.forEach(g => g.url = graphicURL[g.graphicID])
    setGraphics(graphicsWithURL)
    setFinishedGraphicSetting(true)
  }

  async function fetchGraphicResources() {
    await fetchGraphicURLs(lessonID)
      .then(url => {
        setGraphicURL(url)
      })
      .catch(e => {
        showError({
          message: '画像の読み込みに失敗しました。',
          original: e,
          canDismiss: true,
          callback: fetchGraphicResources,
        })

        console.error(e)
      })
  }

  function removeGraphic(graphicID) {

  }

  function swapGraphic(e) {
    console.log('swapGraphic...')
    // graphicsとtimlineの中のgraphicを探して新しいIDとURLに更新する
    // timelineのなか検索する
    // updateLine()
  }

  useEffect(() => {
    fetchGraphicResources()
  }, [])

  useEffect(() => {
    if (finishedGraphicSetting) return
    if (graphics.length === 0) return
    if (Object.keys(graphicURL).length === 0) return

    setURLToGraphics()
  }, [graphics, graphicURL])

  return { graphicURL, removeGraphic, swapGraphic }
}