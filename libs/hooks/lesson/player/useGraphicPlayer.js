import { useState, useCallback, useEffect } from 'react'

export default function useGraphicPlayer({ elapsedTimeRef, graphics, graphicURLs }) {
  const [graphic, setGraphic] = useState()

  const updateGraphic = useCallback(() => {
    const newGraphic = graphics.slice().reverse().find(g => g.elapsedTime <= elapsedTimeRef.current)

    setGraphic(currentGraphic => {
      // requestAnimationFrame経由で呼ばれた場合、最新のstateが取得できないのでsetState中でgraphicを取得する
      if (newGraphic && newGraphic.action === 'show') {
        if (!currentGraphic || currentGraphic.id !== newGraphic.graphicID) {
          const url = graphicURLs[newGraphic.graphicID]
          return { id: newGraphic.graphicID, src: url }
        } else {
          return currentGraphic
        }
      } else {
        return
      }
    })
  }, [elapsedTimeRef, graphicURLs, graphics])

  function seekGraphic() {
    updateGraphic(0)
  }

  const preloadGraphics = useCallback(() => {
    Object.values(graphicURLs).forEach(url => {
      const preloadLink = document.createElement('link')
      preloadLink.href = url
      preloadLink.rel = 'preload'
      preloadLink.as = 'image'
      document.head.appendChild(preloadLink)
    })
  }, [graphicURLs])

  useEffect(() => {
    if (!graphicURLs || Object.keys(graphicURLs).length === 0) return
    preloadGraphics()
    updateGraphic(0)
  }, [graphicURLs, preloadGraphics, updateGraphic])

  return { graphic, updateGraphic, seekGraphic }
}