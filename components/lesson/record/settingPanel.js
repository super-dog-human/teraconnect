/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import { css } from '@emotion/core'

export default function LessonRecordSettingPanel(props) {
  const [draggableBounds, setDraggableBounds] = useState({})
  const draggableElement = useRef(null)

  const bodyStyle = css({
    display: `${props.show ? 'block' : 'none'}`,
    position: 'absolute',
    top: '15%',
    left: '50%',
    cursor: 'default',
    backgroundColor: 'gray',

  })

  useEffect(() => {
    if (!props.show) return

    const left = draggableElement.current.offsetLeft * -1
    const top = draggableElement.current.offsetTop * -1
    const right = draggableElement.current.offsetParent.clientWidth - draggableElement.current.offsetLeft - draggableElement.current.offsetWidth
    const bottom = draggableElement.current.offsetParent.clientHeight - draggableElement.current.offsetTop - draggableElement.current.offsetHeight
    setDraggableBounds({ left ,top, right, bottom })
  }, [props.show])

  return (
    <Draggable bounds={draggableBounds}>
      <div css={bodyStyle} ref={draggableElement}>
        背景画像
        <select>
          <options />
          <options />
          <options />
          <options />
          <options />
          <options />
        </select>
      </div>
    </Draggable>
  )
}