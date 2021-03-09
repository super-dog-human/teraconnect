/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import DragSwappable from '../../dragSwappable'
import Elapsedtime from './line/elapsedtime'
import LessonEditLine from './line/'
import DropLine from './line/dropLine'
import useSwappingLine from '../../../libs/hooks/lesson/edit/useSwappingLine'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'

export default function Timeline() {
  const dropLineRef = useRef()
  const { timeline, swapLine } = useLessonEditorContext()
  const { dragStartIndex, handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleChildDrop }
    = useSwappingLine({ dropLineRef, swapLine })

  return (
    <div css={bodyStyle}>
      <DropLine ref={dropLineRef} onDrop={handleChildDrop} />
      <DragSwappable onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDrop={handleDrop}>
        {Object.keys(timeline).sort((a, b) => a - b).map((elapsedtime, i) => (
          <div key={i} css={dragStartIndex === i && focusedStyle}>
            <div css={lineStyle}>
              <Elapsedtime elapsedtime={elapsedtime} />
              <div css={lineBodyStyle}>
                {Object.keys(timeline[elapsedtime]).map(kind =>
                  timeline[elapsedtime][kind].map((line, i) =>
                    <LessonEditLine key={i} index={i} kind={kind} line={line} />
                  )
                )}
              </div>
            </div>
            {Object.keys(timeline).length - 1 > i && <hr css={hrStyle} />}
          </div>
        ))}
      </DragSwappable>
      {/*最後の要素のelapsedtime + durationが10分を超えていたら警告を出す*/}
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  overflowX: 'scroll',
})

const lineStyle = css({
  cursor: 'pointer',
  display: 'flex',
  paddingTop: '8px',
  paddingBottom: '8px',
})

const lineBodyStyle = css({
  width: '100%',
})

const focusedStyle = css({
  backgroundColor: '#eaeaea', // fixme
})

const hrStyle = css({
  backgroundColor: '#dedede', // fixme
  width: 'calc(100% - 70px)',
  height: '1px',
  marginLeft: '65px',
  marginRight: '5px',
  marginTop: '0px',
  marginBottom: '0px',
})