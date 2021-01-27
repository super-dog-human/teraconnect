/** @jsxImportSource @emotion/react */
import React, { useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import useDraggableBounds from '../../../../libs/hooks/useDraggableBounds'
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs'
import BgImageTab from './bgImageTab'
import BGMTab from './bgmTab'
import AvatarTab from './avatarTab'
import  VoiceRecorderTab from './voiceRecorderTab'
import 'react-tabs/style/react-tabs.css'
import { css } from '@emotion/core'

export default function LessonRecordSettingPanel({ isShow, setIsShow, bgImages, setBgImageURL, avatars, setAvatarConfig,
  bgms, setMicDeviceID, setSilenceThresholdSec, isShowVoiceSpectrum, setIsShowVoiceSpectrum, setRecord }) {
  const draggableRef = useRef(null)
  const { bounds, setBounds } = useDraggableBounds()

  const bodyStyle = css({
    display: isShow ? 'block' : 'none',
    position: 'absolute',
    top: '10%',
    left: 'calc(50% - 250px)',
    backgroundColor: 'gray',
    width: '500px',
    height: '300px',
  })

  const panelHeaderStyle = css({
    cursor: 'move',
  })

  function handleClose() {
    setIsShow(false)
  }

  useEffect(() => {
    if (!isShow) return
    setBounds(draggableRef)
  }, [isShow])

  resetIdCounter()

  return (
    <Draggable bounds={bounds} handle=".drag-handle">
      <div css={bodyStyle} ref={draggableRef} className='modal-panel-z'>
        <div css={panelHeaderStyle} className='drag-handle'>
          <button onClick={handleClose}>x</button>
        </div>

        <Tabs forceRenderTabPanel={true}>
          <TabList>
            <Tab>背景</Tab>
            <Tab>BGM</Tab>
            <Tab>アバター</Tab>
            <Tab>マイク設定</Tab>
          </TabList>

          <TabPanel>
            <BgImageTab images={bgImages} setImageURL={setBgImageURL} setRecord={setRecord} />
          </TabPanel>

          <TabPanel>
            <BGMTab bgms={bgms} setRecord={setRecord} />
          </TabPanel>

          <TabPanel>
            <AvatarTab avatars={avatars} setConfig={setAvatarConfig} setRecord={setRecord} />
          </TabPanel>

          <TabPanel>
            <VoiceRecorderTab setMicDeviceID={setMicDeviceID} setSilenceThresholdSec={setSilenceThresholdSec}
              isShowVoiceSpectrum={isShowVoiceSpectrum} setIsShowVoiceSpectrum={setIsShowVoiceSpectrum} />
          </TabPanel>
        </Tabs>
      </div>
    </Draggable>
  )
}