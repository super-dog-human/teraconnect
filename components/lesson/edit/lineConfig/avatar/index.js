/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Flex from '../../../../flex'
import Spacer from '../../../../spacer'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import Aspect16To9Container from '../../../../aspect16To9Container'
import PlainText from '../../../../plainText'
import InputNumber from '../../../../form/inputNumber'
import LoadingIndicator from '../../../../loadingIndicator'
import DialogHeader from '../configDialog/dialogHeader'
import DialogFooter from '../configDialog/dialogFooter'
import useAvatarConfig from '../../../../../libs/hooks/lesson/edit/useAvatarConfig'
import AlignContainer from '../../../../alignContainer'

export default function Avatar(props) {
  const tabConfig = { elapsedTime: 0 }
  const isProcessing = false
  const { dispatchConfig, isLoading, avatarRef, durationSec, startDragging, inDragging, endDragging, handleDurationChange, handleConfirm, handleCancel } = useAvatarConfig(props)

  return (
    <>
      <DialogHeader onCloseClick={handleCancel} closeButtonDisabled={isProcessing} />

      <ContainerSpacer left='50' right='50'>
        <Flex>
          <Container width='480'>
            <Aspect16To9Container backgroundColor='lightgray'>
              <div ref={avatarRef} css={containerStyle} onMouseDown={startDragging} onMouseMove={inDragging} onMouseUp={endDragging} onMouseLeave={endDragging}
                onTouchStart={startDragging} onTouchMove={inDragging} onTouchEnd={endDragging} onTouchCancel={endDragging} />
              {isLoading && <div css={containerStyle}><LoadingIndicator size='20'/></div>}
            </Aspect16To9Container>
          </Container>
          <Container height='30'>
            <ContainerSpacer top='20' left='20'>
              <Flex>
                <Container width='70'>
                  <PlainText size='14' color='var(--soft-white)'>所要時間</PlainText>
                </Container>
                <Container width='70'>
                  <InputNumber size='16' color='var(--soft-white)' backgroundColor='var(--dark-gray)' borderColor='var(--dark-gray)' value={durationSec} min='0' max='60' step='.001' onChange={handleDurationChange} />
                </Container>
                <Spacer width='10' />
                <AlignContainer verticalAlign='bottom'>
                  <PlainText size='12' color='var(--soft-white)'>秒</PlainText>
                </AlignContainer>
              </Flex>
            </ContainerSpacer>
          </Container>
        </Flex>
      </ContainerSpacer>

      <Spacer height='30' />

      <Container height='60'>
        <ContainerSpacer left='50' right='50'>
          <DialogFooter elapsedTime={tabConfig.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} isProcessing={isProcessing} />
        </ContainerSpacer>
      </Container>
    </>
  )
}

const containerStyle = css({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
})