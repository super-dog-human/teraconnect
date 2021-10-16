/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'
import useLesson from '../../../libs/hooks/lesson/useLesson'
import useTouchDeviceDetector from '../../../libs/hooks/useTouchDeviceDetector'
import useNarrowScreenDetector from '../../../libs/hooks/useNarrowScreenDetector'
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
import PreviewSwitchBar from './previewSwitchBar'
import DurationTime from './durationTime'
import GraphicController from './graphicController/'
import Timeline from './timeline'

export default function LessonEdit({ lessonID }) {
  const fetchedRef = useRef(false)
  const isTouchDevice = useTouchDeviceDetector()
  const isNarrowScreen = useNarrowScreenDetector()
  const [isLoading, setIsLoading] = useState(true)
  const [showPreview, setShowPreview] = useState(true)
  const { clearDiffFlag, clearCache } = useLessonCacheController({ isLoading, lessonID })
  const lesson = useLesson(lessonID)
  const { contextMenu, handleDismiss } = useContextMenuContext()
  const { isInitialLoading, fetchResources } = useLessonEditorContext()
  const { hasResourceDiff, isUpdating, updateLesson, discardLessonDraft, moveToDashboard } = useLessonUpdater({ lessonID, isLoading, clearDiffFlag, clearCache })
  useResourceReloader()
  useSessionExpireChecker()

  const mainStyle = css({
    width: '100%',
    height: !isNarrowScreen && 'calc(100vh - 60px)', // ヘッダの分を差し引いた画面の高さいっぱいに要素を表示
    marginTop: '60px',
    backgroundColor: 'var(--bg-light-gray)',
    userSelect: 'none',
  })

  const bodyStyle = css({
    margin: 'auto',
    maxWidth: '1280px',
    height: '100%',
    display: 'flex',
    gap: '10px',
    flexDirection: isNarrowScreen ? 'column' : 'row',
  })

  const leftSideStyle = css({
    display: !isNarrowScreen || showPreview ? 'flex' : 'none',
    flexDirection: 'column',
    flexGrow: 4,
    maxWidth: isNarrowScreen ? '100%' : '450px',
    height: 'calc(100% - 80px)',
    margin: '40px 10px',
  })

  const rightSideStyle = css({
    display: !isNarrowScreen || !showPreview ? 'block' : 'none',
    flexGrow: 6,
    maxWidth: isNarrowScreen ? '100%' : '830px',
    height: 'calc(100% - 80px)',
    margin: '40px 10px',
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
          {isNarrowScreen && <PreviewSwitchBar showPreview={showPreview} setShowPreview={setShowPreview} />}
          <div css={bodyStyle}>
            <div css={leftSideStyle}>
              <Preview lessonID={lessonID}/>
              <DurationTime />
              <GraphicController isTouchDevice={isTouchDevice} />
            </div>
            <div css={rightSideStyle}>
              <Timeline isTouchDevice={isTouchDevice} isNarrowScreen={isNarrowScreen} />
            </div>
          </div>
          <ImageViwer />
        </ImageViewerProvider>
      </main>
    </>
  )
}