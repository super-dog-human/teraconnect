import { useState, useRef, useCallback, useEffect } from 'react'

export default function useGraphicPlayer({ startElapsedTime, durationSec, graphics, graphicURLs }) {
  const [graphic, setGraphic] = useState()
  const elapsedTimeRef = useRef(startElapsedTime)

  function initializeGraphic() {
    if (elapsedTimeRef.current >= startElapsedTime + durationSec) {
      elapsedTimeRef.current = startElapsedTime
    }
  }

  const updateGraphic = useCallback(incrementalTime => {
    const newElapsedTime = elapsedTimeRef.current + incrementalTime
    const newGraphic = graphics.slice().reverse().find(g => g.elapsedTime <= newElapsedTime)

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

    if (newElapsedTime < startElapsedTime + durationSec) {
      elapsedTimeRef.current = newElapsedTime
    } else {
      elapsedTimeRef.current = startElapsedTime + durationSec
      return
    }
  }, [durationSec, graphicURLs, graphics, startElapsedTime])

  function seekGraphic(e) {
    elapsedTimeRef.current = startElapsedTime + parseFloat(e.target.value)
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

  return { graphic, initializeGraphic, updateGraphic, seekGraphic }
}