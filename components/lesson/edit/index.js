/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'
import useLesson from '../../../libs/hooks/lesson/useLesson'
import useMobileDetector from '../../../libs/hooks/useMobileDetector'
import useLessonCacheController from '../../../libs/hooks/lesson/edit/useLessonCacheController'
import useLessonUpdater from '../../../libs/hooks/lesson/edit/useLessonUpdater'
import { useContextMenuContext } from '../../../libs/contexts/contextMenuContext'
import { useLessonEditorContext } from '../../../libs/contexts/lessonEditorContext'
import { ImageViewerProvider } from '../../../libs/contexts/imageViewerContext'
import useResourceReloader from '../../../libs/hooks/lesson/edit/useResourceReloader'
import useSessionExpireChecker from '../../../libs/hooks/useTokenExpireChecker'
import Loading from './loading'
import ContextMenu from '../../contextMenu'
import ImageViwer from '../../imageViewer'
import Header from '../../authoringHeader'
import Preview from './preview'
import DurationTime from './durationTime'
import GraphicController from './graphicController/'
import Timeline from './timeline'

export default function LessonEdit({ lessonID }) {
  const fetchedRef = useRef(false)
  const isMobile = useMobileDetector()
  const [isLoading, setIsLoading] = useState(true)
  const { clearDiffFlag, clearCache } = useLessonCacheController({ isLoading, lessonID })
  const lesson = useLesson(lessonID)
  const { contextMenu, handleDismiss } = useContextMenuContext()
  const { isInitialLoading, fetchResources } = useLessonEditorContext()
  const { hasResourceDiff, isUpdating, updateLesson, discardLessonDraft, moveToDashboard } = useLessonUpdater({ lessonID, isLoading, clearDiffFlag, clearCache })
  useResourceReloader()
  useSessionExpireChecker()

  const bodyStyle = css({
    margin: 'auto',
    maxWidth: '1280px',
    height: '100%',
    display: 'flex',
    flexDirection: isMobile ? 'column' : 'row',
  })

  const leftSideStyle = css({
    display: 'flex',
    flexDirection: 'column',
    flexGrow: 4,
    maxWidth: isMobile ? '100%' : '450px',
    height: 'calc(100% - 80px)',
    marginTop: '40px',
    marginLeft: '10px',
    marginBottom: '40px',
  })

  const rightSideStyle = css({
    flexGrow: 6,
    maxWidth: isMobile ? '100%' : '830px',
    height: 'calc(100% - 80px)',
    marginTop: '40px',
    marginLeft: '50px',
    marginRight: '10px',
    marginBottom: '40px',
  })

  useEffect(() => {
    if (!lesson) return
    if (fetchedRef.current) return
    fetchResources(lesson)
    fetchedRef.current = true
  }, [fetchResources, lesson])

  useEffect(() => {
    if (!isInitialLoading) {
      setIsLoading(false)
    }
  }, [isInitialLoading])

  return (
    <>
      <ContextMenu {...contextMenu} handleDismiss={handleDismiss} />
      <Loading isShow={isLoading} />
      <Header currentPage='edit' showBadge={hasResourceDiff} isUpdating={isUpdating} updateLesson={updateLesson} discardLessonDraft={discardLessonDraft} moveToDashboard={moveToDashboard} />
      <main css={mainStyle}>
        <ImageViewerProvider>
          <div css={bodyStyle}>
            <div css={leftSideStyle}>
              <Preview lessonID={lessonID}/>
              <DurationTime />
              <GraphicController />
            </div>
            <div css={rightSideStyle}>
              <Timeline />
            </div>
          </div>
          <ImageViwer />
        </ImageViewerProvider>
      </main>
    </>
  )
}

const mainStyle = css({
  width: '100%',
  height: 'calc(100vh - 60px)', // ヘッダの分を差し引いた画面の高さいっぱいに要素を表示
  marginTop: '60px',
  backgroundColor: 'var(--bg-light-gray)',
  userSelect: 'none',
})

