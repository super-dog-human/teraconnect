/** @jsxImportSource @emotion/react */
import React, { useState, useRef, useEffect } from 'react'
import Draggable from 'react-draggable'
import { Tab, Tabs, TabList, TabPanel, resetIdCounter } from 'react-tabs'
import BgImageTab from './bgImageTab'
import BGMTab from './bgmTab'
import AvatarTab from './avatarTab'
import 'react-tabs/style/react-tabs.css'
import { css } from '@emotion/core'

export default function LessonRecordSettingPanel(props) {
  const [disabledDrag, setDisabledDrag] = useState(false)
  const [draggableBounds, setDraggableBounds] = useState({})
  const draggableElement = useRef(null)

  const bodyStyle = css({
    display: `${props.show ? 'block' : 'none'}`,
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
    props.setShow(false)
  }

  function calcDraggableBounds() {
    const left = draggableElement.current.offsetLeft * -1
    const top = draggableElement.current.offsetTop * -1
    const right = draggableElement.current.offsetParent.clientWidth - draggableElement.current.offsetLeft - draggableElement.current.offsetWidth
    const bottom = draggableElement.current.offsetParent.clientHeight - draggableElement.current.offsetTop - draggableElement.current.offsetHeight
    return { left ,top, right, bottom }
  }

  useEffect(() => {
    if (!props.show) return
    setDraggableBounds(calcDraggableBounds())
  }, [props.show])

  resetIdCounter()

  return (
    <Draggable bounds={draggableBounds} disabled={disabledDrag} handle=".drag-handle">
      <div css={bodyStyle} ref={draggableElement} className='modal-panel-z'>
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
            <BgImageTab images={props.bgImages} setImageURL={props.setBgImageURL} setRecord={props.setRecord} />
          </TabPanel>

          <TabPanel>
            <BGMTab bgms={props.bgms} setRecord={props.setRecord} />
          </TabPanel>

          <TabPanel>
            <AvatarTab avatars={props.avatars} setAvatarConfig={props.setAvatarConfig} setDisabledDrag={setDisabledDrag} setRecord={props.setRecord} />
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