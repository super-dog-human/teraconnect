/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { css } from '@emotion/core'
import RecordIcon from './recordIcon'
import DrawingConfigPanel from './drawingConfigPanel'
import DrawingConfigButton from './drawingConfigButton'

export default function LessonRecordHeader({ isMicReady, isRecording, setIsRecording, setRecord,
  isDrawingHide, setIsDrawingHide, enablePen, setEnablePen, undoDrawing, clearDrawing,
  drawingColor, setDrawingColor, setDrawingLineWidth, setIsShowControlPanel }) {

  function handleRecording() {
    setIsRecording(!isRecording)
  }

  function handleDrawingHide() {
    setIsDrawingHide(!isDrawingHide)
    setRecord({ drawingHide: !isDrawingHide })
  }

  function handlePen() {
    setEnablePen(!enablePen)
  }

  function handleDrawingUndo() {
    undoDrawing()
    setRecord({ drawingUndo: true })
  }

  function handleDrawingClear() {
    clearDrawing()
    setRecord({ drawingClear: true })
  }

  function handleSettingPanel() {
    setIsShowControlPanel(state => !state)
  }

  return (
    <header css={headerStyle} className='header-z'>
      <div css={bodyStyle}>
        <div css={flexItemStyle}>
          <Link href="/">
            <a>
              <img
                css={logoImageStyle}
                src="/img/logo_white.png"
                srcSet="/img/logo_white.png 1x, /img/logo_white@2x.png 2x"
              />
            </a>
          </Link>
        </div>
        <div css={flexItemStyle}>
          <button onClick={handleRecording} css={recordingButtonStyle} disabled={!isMicReady}>
            <div css={recordingIconStyle}>
              <RecordIcon recording={isRecording} />
            </div>
            <div css={recordingStatusStyle}>
              <span>{isRecording ? '' : ''}</span>
            </div>
          </button>
        </div>
        <div css={flexItemStyle}>
          <DrawingConfigButton onClick={handleDrawingHide} isSelected={isDrawingHide}>
            <img src="/img/icon/hide.svg" />
          </DrawingConfigButton>
          <DrawingConfigButton disabled={isDrawingHide} isSelected={!isDrawingHide && enablePen} onClick={handlePen}>
            <img src="/img/icon/drawing.svg" />
          </DrawingConfigButton>
          <DrawingConfigPanel disabled={isDrawingHide} color={drawingColor} setColor={setDrawingColor} setLineWidth={setDrawingLineWidth}
            setEnablePen={setEnablePen} setIsDrawingHide={setIsDrawingHide} />
          <DrawingConfigButton disabled={isDrawingHide} onClick={handleDrawingUndo}>
            <img src="/img/icon/undo.svg" />
          </DrawingConfigButton>
          <DrawingConfigButton disabled={isDrawingHide} onClick={handleDrawingClear}>
            <img src="/img/icon/trash.svg" />
          </DrawingConfigButton>
          <DrawingConfigButton css={settingButtonStyle} onClick={handleSettingPanel}>
            <img src="/img/icon/settings.svg" />
          </DrawingConfigButton>
        </div>
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

const logoImageStyle = css({
  width: '181px',
  height: '25px',
  verticalAlign: 'middle',
})

const flexItemStyle = css({
  width: '100%',
  textAlign: 'center',
})

const recordingButtonStyle = css({
  position: 'relative',
  ['img']: {
    width: '26px',
    height: 'auto',
    verticalAlign: 'middle',
  },
  [':hover']: {
    backgroundColor: 'var(--text-gray)',
  },
  [':disabled']: {
    opacity: 0.3,
  },
})

const recordingStatusStyle = css({
  position: 'absolute',
  height: '77px',
  top: 0,
  left: 50,
})

const recordingIconStyle = css({
  width: '26px',
  height: '26px',
})

const settingButtonStyle = css({
  marginLeft: '150px',
})