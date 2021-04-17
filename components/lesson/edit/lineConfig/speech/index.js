import React from 'react'
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
import useSpeechConfig from '../../../../../libs/hooks/lesson/edit/useSpeechConfig'
import 'react-tabs/style/react-tabs.css'

export default function Speech(props) {
  const { isProcessing, tabConfig, setTabConfig, handleConfirm, handleClose } = useSpeechConfig(props)

  resetIdCounter()

  return (
    <>
      <TabContainer minHeight='340'>
        <Tabs forceRenderTabPanel={true}>
          <DragHandler>
            <TabList>
              <TabListWithCloseButton onClose={handleClose} color='var(--soft-white)'>
                <Tab><AlignContainer textAlign='center'>字幕・テロップ</AlignContainer></Tab>
                <Tab><AlignContainer textAlign='center'>音声</AlignContainer></Tab>
              </TabListWithCloseButton>
            </TabList>
          </DragHandler>
          <TabPanel>
            <TextTab config={tabConfig} setConfig={setTabConfig} />
          </TabPanel>
          <TabPanel>
            <VoiceTab config={tabConfig} setConfig={setTabConfig} />
          </TabPanel>
        </Tabs>
      </TabContainer>
      <Container height='60'>
        <ContainerSpacer left='50' right ='50'>
          <DialogFooter elapsedtime={tabConfig.elapsedtime} onConfirm={handleConfirm} onCancel={handleClose} isProcessing={isProcessing} />
        </ContainerSpacer>
      </Container>
    </>
  )
}