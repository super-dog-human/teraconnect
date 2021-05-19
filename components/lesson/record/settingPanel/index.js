/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import 'react-tabs/style/react-tabs.css'
import Draggable from 'react-draggable'
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs'
import TabListWithCloseButton from '../../../tab/tabListWithCloseButton'
import TabContainer from '../../../tab/tabContainer'
import DragHandler from '../../../dragHandler'
import AlignContainer from '../../../alignContainer'
import BgImageTab from './bgImageTab'
import AvatarTab from './avatarTab'
import VoiceRecorderTab from './voiceRecorderTab'

export default function SettingPanel({ isShow, setIsShow, bgImages, setBgImageURL, avatars, setAvatarConfig,
  setMicDeviceID, setSilenceThresholdSec, isShowVoiceSpectrum, silenceThresholdSec, setIsShowVoiceSpectrum }) {

  function handleClose() {
    setIsShow(false)
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
    filter: 'drop-shadow(2px 2px 2px gray)',
  })

  return (
    <Draggable handle=".drag-handle">
      <div css={bodyStyle} className='modal-panel-z'>
        <TabContainer minHeight='300'>
          <Tabs forceRenderTabPanel={true}>
            <DragHandler>
              <TabList>
                <TabListWithCloseButton onClose={handleClose} color='var(--soft-white)'>
                  <Tab><AlignContainer textAlign='center'>背景</AlignContainer></Tab>
                  <Tab><AlignContainer textAlign='center'>アバター</AlignContainer></Tab>
                  <Tab><AlignContainer textAlign='center'>マイク設定</AlignContainer></Tab>
                </TabListWithCloseButton>
              </TabList>
            </DragHandler>
            <TabPanel>
              <BgImageTab images={bgImages} setImageURL={setBgImageURL} />
            </TabPanel>
            <TabPanel>
              <AvatarTab avatars={avatars} setConfig={setAvatarConfig} />
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