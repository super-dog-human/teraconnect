/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import ContainerSpacer from '../../containerSpacer'
import DragSwappable from '../../dragSwappable'
import ElapsedTime from './line/elapsedTime'
import LineConfig from './lineConfig/'
import DropLine from './line/dropLine'
import PlainText from '../../plainText'
import Hr from '../../hr'
import LessonLine from './line/'
import LessonLineAvatar from './line/avatar'
import LessonLineDrawing from './line/drawing'
import LessonLineEmbedding from './line/embedding'
import LessonLineGraphic from './line/graphic'
import LessonLineMusic from './line/music'
import LessonLineSpeech from './line/speech'
import useSwappingLine from '../../../libs/hooks/lesson/edit/useSwappingLine'
import useLineConfig from '../../../libs/hooks/lesson/edit/useLineConfig'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'

export default function Timeline() {
  const dropLineRef = useRef()
  const lastTimesRef = useRef({})
  const { durationSec, timeline, drawings, swapLine } = useLessonEditorContext()
  const { handleDragStart, handleDragEnd, handleDragOver, handleDrop, handleChildDrop } = useSwappingLine({ dropLineRef, swapLine })
  const { handleEditButtonClick, hasDoubleTimeError, lineConfig, setLineConfig } = useLineConfig()

  return (
    <div css={bodyStyle}>
      <DropLine ref={dropLineRef} onDrop={handleChildDrop} />
      <LineConfig lineConfig={lineConfig} setLineConfig={setLineConfig} />
      <DragSwappable onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd} onDrop={handleDrop}>
        {Object.keys(timeline).sort((a, b) => a - b).map((elapsedTime, i) => {
          if (i === 0) lastTimesRef.current = {}
          return (
            <React.Fragment key={i}>
              <div css={lineStyle}>
                <ElapsedTime elapsedTime={elapsedTime} />
                <div css={lineBodyStyle}>
                  {Object.keys(timeline[elapsedTime]).map(kind =>
                    timeline[elapsedTime][kind].map((line, kindIndex) => {
                      const hasError = hasDoubleTimeError({ lastTimesRef, elapsedTime, kind, line })
                      return (
                        <LessonLine key={`${elapsedTime}-${kindIndex}`} kind={kind} hasError={hasError}>
                          {kind === 'avatar'    && <LessonLineAvatar avatar={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                          {kind === 'drawing'   && <LessonLineDrawing drawings={drawings} drawing={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                          {kind === 'embedding' && <LessonLineEmbedding embedding={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                          {kind === 'graphic'   && <LessonLineGraphic graphic={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                          {kind === 'music'     && <LessonLineMusic music={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                          {kind === 'speech'    && <LessonLineSpeech speech={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                        </LessonLine>
                      )}
                    ))}
                </div>
              </div>
              {Object.keys(timeline).length - 1 > i && <ContainerSpacer left='60'>
                <Hr color='#dedede' />
              </ContainerSpacer>}
            </React.Fragment>
          )
        })}
      </DragSwappable>
      { durationSec > 600 && <PlainText color='var(--error-red)'>収録時間が10分を超えています。</PlainText>}
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
})

const lineStyle = css({
  cursor: 'pointer',
  display: 'flex',
  paddingTop: '5px',
  paddingBottom: '5px',
})

const lineBodyStyle = css({
  width: '100%',
})