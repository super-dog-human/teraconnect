/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/react'
import ContainerSpacer from '../../containerSpacer'
import AddLineButton from './addLineButton'
import ElapsedTime from './line/elapsedTime'
import LineConfig from './lineConfig/'
import TimeShifterLine from './timeShifter/line'
import LessonLine from './line/'
import LessonLineAvatar from './line/avatar'
import LessonLineDrawing from './line/drawing'
import LessonLineEmbedding from './line/embedding'
import LessonLineGraphic from './line/graphic'
import LessonLineMusic from './line/music'
import LessonLineSpeech from './line/speech'
import useUpdateSpeechLine from '../../../libs/hooks/lesson/edit/timeline/useUpdatingSpeechLine'
import useLineConfig from '../../../libs/hooks/lesson/edit/useLineConfig'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'

export default function Timeline({ isTouchDevice, isNarrowScreen }) {
  const lastTimesRef = useRef({})
  const { timeline, drawings, updateLine } = useLessonEditorContext()
  const { handleEditButtonClick, hasDoubleTimeError, lineConfig, setLineConfig } = useLineConfig()
  const { isLineProcessing, setIsLineProcessing, updateSpeechLine } = useUpdateSpeechLine({ timeline, updateLine })

  return (
    <div css={bodyStyle}>
      <LineConfig lineConfig={lineConfig} setLineConfig={setLineConfig} isTouchDevice={isTouchDevice} />
      {Object.keys(timeline).length === 0 && <AddLineButton isNarrowScreen={isNarrowScreen} setLineConfig={setLineConfig} />}
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
                      <LessonLine key={`${i}-${kindIndex}`} kind={kind} hasError={hasError} isLineProcessing={isLineProcessing} isTouchDevice={isTouchDevice}>
                        {kind === 'avatar'    && <LessonLineAvatar avatar={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                        {kind === 'drawing'   && <LessonLineDrawing drawings={drawings} drawing={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                        {kind === 'embedding' && <LessonLineEmbedding embedding={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                        {kind === 'graphic'   && <LessonLineGraphic graphic={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                        {kind === 'music'     && <LessonLineMusic music={line} index={kindIndex} handleEditClick={handleEditButtonClick} />}
                        {kind === 'speech'    && <LessonLineSpeech speech={line} index={kindIndex} lineIndex={i} handleEditClick={handleEditButtonClick} setIsLineProcessing={setIsLineProcessing} updateSpeechLine={updateSpeechLine} />}
                      </LessonLine>
                    )}
                  ))}
              </div>
            </div>
            {Object.keys(timeline).length - 1 > i && <ContainerSpacer left='60'>
              <TimeShifterLine />
            </ContainerSpacer>}
          </React.Fragment>
        )
      })}
    </div>
  )
}

const bodyStyle = css({
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
})

const lineStyle = css({
  display: 'flex',
  paddingTop: '5px',
  paddingBottom: '5px',
})

const lineBodyStyle = css({
  width: '100%',
})