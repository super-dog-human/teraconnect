import { useState } from 'react'

export default function useDraggableBounds() {
  const [bounds, setBounds] = useState({})

  function setDraggableBounds(ref) {
    const left = ref.current.offsetLeft * -1
    const top = ref.current.offsetTop * -1
    const right = ref.current.offsetParent.clientWidth - ref.current.offsetLeft - ref.current.offsetWidth
    const bottom = ref.current.offsetParent.clientHeight - ref.current.offsetTop - ref.current.offsetHeight
    setBounds({ left ,top, right, bottom })
  }

  return { bounds, setBounds: setDraggableBounds }
}