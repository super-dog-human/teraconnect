/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import ContainerSpacer from '../../containerSpacer'
import DragSwappable from '../../dragSwappable'
import Elapsedtime from './line/elapsedtime'
import ContextMenu from '../../contextMenu'
import LineConfig from './lineConfig/'
import DropLine from './line/dropLine'
import LessonLine from './line/'
import LessonLineAvatar from './line/avatar'
import LessonLineDrawing from './line/drawing'
import LessonLineGraphic from './line/graphic'
import LessonLineMusic from './line/music'
import LessonLineSpeech from './line/speech'
import useSwappingLine from '../../../libs/hooks/lesson/edit/useSwappingLine'
import useLineConfig from '../../../libs/hooks/lesson/edit/useLineConfig'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'

export default function Timeline() {
  const dropLineRef = useRef()
  const { timeline, swapLine } = useLessonEditorContext()
  const { dragStartIndex, handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleChildDrop } = useSwappingLine({ dropLineRef, swapLine })
  const { handleEditButtonClick, menuOption, lineConfig } = useLineConfig()

  return (
    <div css={bodyStyle}>
      <DropLine ref={dropLineRef} onDrop={handleChildDrop} />
      <ContextMenu menuOption={menuOption} />
      <LineConfig config={lineConfig} />
      <DragSwappable onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDrop={handleDrop}>
        {Object.keys(timeline).sort((a, b) => a - b).map((elapsedtime, i) => (
          <div key={i} css={dragStartIndex === i && focusedStyle}>
            <div css={lineStyle}>
              <Elapsedtime elapsedtime={elapsedtime} />
              <div css={lineBodyStyle}>
                {Object.keys(timeline[elapsedtime]).map(kind =>
                  timeline[elapsedtime][kind].map((line, kindIndex) => (
                    <LessonLine key={`${elapsedtime}-${kindIndex}`}>
                      {kind === 'avatar'  && <LessonLineAvatar avatar={line} lineIndex={i} kindIndex={kindIndex} handleEditClick={handleEditButtonClick} />}
                      {kind === 'drawing' && <LessonLineDrawing drawing={line} lineIndex={i} kindIndex={kindIndex} handleEditClick={handleEditButtonClick} />}
                      {kind === 'graphic' && <LessonLineGraphic graphic={line} lineIndex={i} kindIndex={kindIndex} handleEditClick={handleEditButtonClick} />}
                      {kind === 'music'   && <LessonLineMusic music={line} lineIndex={i} kindIndex={kindIndex} handleEditClick={handleEditButtonClick} />}
                      {kind === 'speech'  && <LessonLineSpeech speech={line} lineIndex={i} kindIndex={kindIndex} handleEditClick={handleEditButtonClick} />}
                    </LessonLine>
                  ))
                )}
              </div>
            </div>
            {Object.keys(timeline).length - 1 > i && <ContainerSpacer left='65'><hr css={hrStyle} /></ContainerSpacer>}
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
})