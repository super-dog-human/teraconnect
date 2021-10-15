import React, { useState } from 'react'
import { Tab, TabList, Tabs, TabPanel, resetIdCounter } from 'react-tabs'
import TabListWithCloseButton from '../../../../tab/tabListWithCloseButton'
import TabContainer from '../../../../tab/tabContainer'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import DragHandler from '../../../../dragHandler'
import VoiceTab from './voiceTab'
import TextTab from './textTab'
import DialogFooter from '../configDialog/dialogFooter'
import PlainText from '../../../../plainText'
import useSpeechConfig from '../../../../../libs/hooks/lesson/edit/useSpeechConfig'
import 'react-tabs/style/react-tabs.css'

export default function Speech(props) {
  const { isProcessing, config, dispatchConfig, handleConfirm, handleCancel } = useSpeechConfig(props)
  const [tabIndex, setTabIndex] = useState(0)

  function handleTabTouch(e) {
    setTabIndex(parseInt(e.currentTarget.dataset.index))
  }

  resetIdCounter()

  return (
    <>
      <TabContainer minHeight='340'>
        <Tabs forceRenderTabPanel={true} selectedIndex={tabIndex} onSelect={() => {}}>
          <DragHandler>
            <TabList>
              <TabListWithCloseButton onClose={handleCancel} color='var(--soft-white)' disabled={isProcessing}>
                <Tab data-index={0} onClick={handleTabTouch} onTouchEnd={handleTabTouch}>
                  <AlignContainer textAlign='center'><PlainText size='14'>字幕・テロップ</PlainText></AlignContainer>
                </Tab>
                <Tab data-index={1} onClick={handleTabTouch} onTouchEnd={handleTabTouch}>
                  <AlignContainer textAlign='center'><PlainText size='14'>音声</PlainText></AlignContainer>
                </Tab>
              </TabListWithCloseButton>
            </TabList>
          </DragHandler>
          <TabPanel>
            <TextTab config={config} dispatchConfig={dispatchConfig} />
          </TabPanel>
          <TabPanel>
            <VoiceTab config={config} dispatchConfig={dispatchConfig} />
          </TabPanel>
        </Tabs>
      </TabContainer>
      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={config.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} isProcessing={isProcessing} />
        </ContainerSpacer>
      </Container>
    </>
  )
}