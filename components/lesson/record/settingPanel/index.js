/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs'
import BgImageTab from './bgImageTab'
import BGMTab from './bgmTab'
import AvatarTab from './avatarTab'
import 'react-tabs/style/react-tabs.css'
import { css } from '@emotion/core'

export default function LessonRecordSettingPanel({ isShow, setIsShow, bgImages, setBgImageURL, bgms, avatars, setAvatarConfig, setRecord }) {
  const [draggableBounds, setDraggableBounds] = useState({})
  const draggableRef = useRef(null)

  const bodyStyle = css({
    display: `${isShow ? 'block' : 'none'}`,
    position: 'absolute',
    top: '10%',
    left: 'calc(50% - 250px)',
    cursor: 'pointer',
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

  function calcDraggableBounds() {
    const left = draggableRef.current.offsetLeft * -1
    const top = draggableRef.current.offsetTop * -1
    const right = draggableRef.current.offsetParent.clientWidth - draggableRef.current.offsetLeft - draggableRef.current.offsetWidth
    const bottom = draggableRef.current.offsetParent.clientHeight - draggableRef.current.offsetTop - draggableRef.current.offsetHeight
    return { left ,top, right, bottom }
  }

  useEffect(() => {
    if (!isShow) return
    setDraggableBounds(calcDraggableBounds())
  }, [isShow])

  resetIdCounter()

  return (
    <Draggable bounds={draggableBounds} handle=".drag-handle">
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
            <div>使用マイク</div>
            <div>無音閾値</div>
          </TabPanel>
        </Tabs>
      </div>
    </Draggable>
  )
}