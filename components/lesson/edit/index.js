/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useScreenClass } from 'react-grid-system'
import useLessonEditor from '../../../libs/hooks/lesson/edit/useLessonEditor'
import { ImageViewerProvider } from '../../../libs/contexts/imageViewerContext'
import ImageViwer from '../../imageViewer'
import LessonEditHeader from './header'
import LessonEditPreview from './preview'
import LessonDurationTime from './durationTime'
import LessonEditGraphicController from './graphicController/'
import LessonEditTimeline from './timeline'

const LessonEdit = React.forwardRef(function lessonEdit({ lesson }, ref) {
  const screenClass = useScreenClass()
  const { isLoading, durationSec, timeline, avatars, graphics, drawings, speeches, setGraphics, updateLine } = useLessonEditor(lesson)

  const bodyStyle = css({
    margin: 'auto',
    maxWidth: '1280px',
    height: '100%',
    display: 'flex',
    flexDirection: ['xs', 'sm'].includes(screenClass) ? 'column' : 'row',
  })

  const leftSideStyle = css({
    flexGrow: '4',
    maxWidth: ['xs', 'sm'].includes(screenClass) ? '100%' : '450px',
    height: '100%',
    marginTop: '40px',
  })

  const rightSideStyle = css({
    flexGrow: '6',
    maxWidth: ['xs', 'sm'].includes(screenClass) ? '100%' : '830px',
    height: 'calc(100% - 80px)',
    marginTop: '40px',
    marginLeft: '40px',
    marginBottom: '40px',
  })

  return (
    <>
      <LessonEditHeader />
      <main css={mainStyle} ref={ref}>
        <ImageViewerProvider>
          <ImageViwer />
          <div css={bodyStyle}>
            <div css={leftSideStyle}>
              <LessonEditPreview avatars={avatars} graphics={graphics} drawings={drawings} speeches={speeches} />
              <LessonDurationTime durationSec={durationSec} />
              <LessonEditGraphicController lessonID={lesson.id} graphics={graphics} setGraphics={setGraphics} updateLine={updateLine} />
            </div>
            <div css={rightSideStyle}>
              <LessonEditTimeline timeline={timeline} />
            </div>
          </div>
        </ImageViewerProvider>
      </main>
    </>
  )
})

export default LessonEdit

const mainStyle = css({
  width: '100%',
  height: 'calc(100vh - 77px)', // ヘッダの分を差し引いた画面の高さいっぱいに要素を表示
  backgroundColor: 'var(--bg-light-gray)',
  userSelect: 'none',
})

