/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useLessonRecorderContext } from '../../../../libs/contexts/lessonRecorderContext'
import Flex from '../../../flex'
import Spacer from '../../../spacer'
import TopLogoLink from '../../../topLogoLink'
import RecordingButton from './recordingButton'
import DrawingConfigPanel from '../drawingController/drawingConfigPanel'
import DrawingConfigButton from '../drawingController/drawingConfigButton'

export default function LessonRecordHeader({ lessonID, isMicReady, isDrawingHide, setIsDrawingHide, enablePen, setEnablePen,
  undoDrawing, clearDrawing, drawingColor, setDrawingColor, setDrawingLineWidth, isShowControlPanel, setIsShowControlPanel }) {
  const { isFinishing } = useLessonRecorderContext()

  function handleDrawingHide() {
    setIsDrawingHide(state => !state)
  }

  function handlePen() {
    setEnablePen(state => !state)
  }

  function handleSettingPanel() {
    setIsShowControlPanel(state => !state)
  }

  return (
    <header css={headerStyle} className="header-z">
      <div css={bodyStyle}>
        <div css={fullWidthStyle}>
          <TopLogoLink color="white" />
        </div>
        <div css={fullWidthStyle}>
          <RecordingButton lessonID={lessonID} isMicReady={isMicReady} />
        </div>
        <div css={fullWidthStyle}>
          <Flex justifyContent='center' alignItems='center'>
            <DrawingConfigButton name='hide' disabled={isFinishing} onClick={handleDrawingHide} isSelected={isDrawingHide} />
            <Spacer width='15' />
            <DrawingConfigButton name='drawing' disabled={isDrawingHide || isFinishing} isSelected={!isDrawingHide && enablePen} onClick={handlePen} />
            <DrawingConfigPanel disabled={isDrawingHide || isFinishing} color={drawingColor} setColor={setDrawingColor} setLineWidth={setDrawingLineWidth} setEnablePen={setEnablePen} />
            <Spacer width='10' />
            <DrawingConfigButton name='undo' disabled={isDrawingHide || isFinishing} onClick={undoDrawing} />
            <Spacer width='15' />
            <DrawingConfigButton name='trash' disabled={isDrawingHide || isFinishing} onClick={clearDrawing} />
          </Flex>
        </div>
        <div>
          <DrawingConfigButton name='settings' disabled={isFinishing} isSelected={isShowControlPanel} onClick={handleSettingPanel} />
        </div>
        <Spacer width='20' />
      </div>
    </header>
  )
}

const headerStyle = css({
  width: '100%',
  backgroundColor: 'var(--dark-gray)',
  position: 'fixed',
  top: 0,
  left: 0,
  userSelect: 'none',
})

const bodyStyle = css({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1280px',
  height: '77px',
  marginLeft: 'auto',
  marginRight: 'auto',
})

const fullWidthStyle = css({
  width: '100%',
})