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
  const { isProcessing, config, dispatchConfig, handleConfirm, handleCancel } = useSpeechConfig(props)

  resetIdCounter()

  return (
    <>
      <TabContainer minHeight='340'>
        <Tabs forceRenderTabPanel={true}>
          <DragHandler>
            <TabList>
              <TabListWithCloseButton onClose={handleCancel} color='var(--soft-white)' disabled={isProcessing}>
                <Tab><AlignContainer textAlign='center'>字幕・テロップ</AlignContainer></Tab>
                <Tab><AlignContainer textAlign='center'>音声</AlignContainer></Tab>
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