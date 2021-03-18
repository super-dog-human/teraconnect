/** @jsxImportSource @emotion/react */
import React from 'react'
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs'
import VoiceTab from './voiceTab'
import TextTab from './textTab'
import { css } from '@emotion/core'
import { useLessonEditorContext } from '../../../../../libs/contexts/lessonEditorContext'
import 'react-tabs/style/react-tabs.css'

export default function Speech({ config, closeCallback }) {
  const { updateLine } = useLessonEditorContext()

  function handleConfirmClick() {
    updateLine(config.lineIndex, config.kindIndex, 'speech', config.line)
    closeCallback()
  }

  function handleCloseClick() {
    closeCallback()
  }

  resetIdCounter()

  return (
    <div css={bodyStyle}>
      <Tabs forceRenderTabPanel={true}>
        <div css={dragHandleStyle} className="drag-handle">
          <TabList>
            <Tab>字幕・テロップ</Tab>
            <Tab>音声</Tab>
            <button css={closeButtonStyle} onClick={handleCloseClick}>x</button>
          </TabList>
        </div>
        <TabPanel>
          <TextTab config={config.line} handleClose={handleCloseClick} />
        </TabPanel>
        <TabPanel>
          <VoiceTab config={config.line} handleClose={handleCloseClick} />
        </TabPanel>
      </Tabs>
    </div>
  )
}

const bodyStyle = css({
  minHeight: '400px',
  ['.react-tabs__tab-list']: {
    border: 'none',
  },
  ['.react-tabs__tab']: {
    //    backgroundColor: 'black',
  }
})

const dragHandleStyle = css({
  cursor: 'move',
})

const closeButtonStyle = css({
  textAlign: 'right',
})