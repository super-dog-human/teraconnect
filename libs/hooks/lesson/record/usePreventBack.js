import { useEffect } from 'react'

export default function usePreventBack() {
  useEffect(() => {
    function handleBeforeunload(e) {
      e.preventDefault()
      e.returnValue = ''
    }

    function handleWheel(e) {
      if (e.deltaX >= 0) return
      if (hasLeftScrollElementAndParents(e.target)) return
      e.preventDefault() // 斜め方向のスワイプもキャンセルされてしまうので上下スクロールができない場合がある？
    }

    function hasLeftScrollElementAndParents(elm) {
      let currentParent = elm.parentElement
      const parents = []
      while (currentParent) {
        parents.unshift(currentParent)
        currentParent = currentParent.parentElement
      }
      return parents.some(p => p.scrollLeft > 0)
    }

    window.addEventListener('beforeunload', handleBeforeunload)
    window.addEventListener('wheel', handleWheel, { passive: false })

    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])
}