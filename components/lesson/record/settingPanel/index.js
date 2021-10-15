/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import 'react-tabs/style/react-tabs.css'
import Draggable from 'react-draggable'
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs'
import TabListWithCloseButton from '../../../tab/tabListWithCloseButton'
import TabContainer from '../../../tab/tabContainer'
import DragHandler from '../../../dragHandler'
import AlignContainer from '../../../alignContainer'
import PlainText from '../../../plainText'
import BgImageTab from './bgImageTab'
import AvatarTab from './avatarTab'
import VoiceRecorderTab from './voiceRecorderTab'

export default function SettingPanel({ isShow, setIsShow, bgImages, setBgImageURL, avatars, setAvatarConfig, cleanAvatar,
  setMicDeviceID, setSilenceThresholdSec, isShowVoiceSpectrum, silenceThresholdSec, setIsShowVoiceSpectrum }) {
  const [tabIndex, setTabIndex] = useState(0)

  function handleClose() {
    setIsShow(false)
  }

  function handleTabTouch(e) {
    setTabIndex(parseInt(e.currentTarget.dataset.index))
  }

  resetIdCounter()

  const bodyStyle = css({
    display: isShow ? 'block' : 'none',
    position: 'absolute',
    top: '10%',
    left: 'calc(50% - 250px)',
    width: '500px',
    maxWidth: '700px',
    backgroundColor: 'var(--dark-gray)',
    borderRadius: '5px',
  })

  return (
    <Draggable handle=".drag-handle">
      <div css={bodyStyle} className='modal-panel-z'>
        <TabContainer minHeight='300'>
          <Tabs forceRenderTabPanel={true} selectedIndex={tabIndex} onSelect={() => {}}>
            <DragHandler>
              <TabList>
                <TabListWithCloseButton onClose={handleClose} color='var(--soft-white)'>
                  <Tab data-index={0} onClick={handleTabTouch} onTouchEnd={handleTabTouch}>
                    <AlignContainer textAlign='center'><PlainText size='14'>背景</PlainText></AlignContainer>
                  </Tab>
                  <Tab data-index={1} onClick={handleTabTouch} onTouchEnd={handleTabTouch}>
                    <AlignContainer textAlign='center'><PlainText size='14'>アバター</PlainText></AlignContainer>
                  </Tab>
                  <Tab data-index={2} onClick={handleTabTouch} onTouchEnd={handleTabTouch}>
                    <AlignContainer textAlign='center'><PlainText size='14'>マイク設定</PlainText></AlignContainer>
                  </Tab>
                </TabListWithCloseButton>
              </TabList>
            </DragHandler>
            <TabPanel>
              <BgImageTab images={bgImages} setImageURL={setBgImageURL} />
            </TabPanel>
            <TabPanel>
              <AvatarTab avatars={avatars} setConfig={setAvatarConfig} cleanAvatar={cleanAvatar} />
            </TabPanel>
            <TabPanel>
              <VoiceRecorderTab setMicDeviceID={setMicDeviceID} setSilenceThresholdSec={setSilenceThresholdSec}
                isShowVoiceSpectrum={isShowVoiceSpectrum} silenceThresholdSec={silenceThresholdSec} setIsShowVoiceSpectrum={setIsShowVoiceSpectrum} />
            </TabPanel>
          </Tabs>
        </TabContainer>
      </div>
    </Draggable>
  )
}