/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import { useDialogContext } from '../../libs/contexts/dialogContext'
import DismissButton from './dismissButton'
import ConfirmButton from './confirmButton'
import Checkbox from '../form/inputCheckbox'
import FullscreenContainer from '../fullscreenContainer'
import Flex from '../flex'
import Spacer from '../spacer'
import Container from '../container'
import PlainText from '../plainText'

export default function Dialog() {
  const { dialog, isProcessing, confirmDialog, dismissDialog } = useDialogContext()
  const skipConfirmRef = useRef()

  function handleConfirm() {
    confirmDialog(skipConfirmRef.current?.checked)
  }

  return (
    <>
      {dialog &&
        <div className="fullscreen-dialog-z">
          <FullscreenContainer position='fixed'>
            <div css={dialogStyle}>
              <div css={headerStyle}>
                <Container height='50'>
                  <Flex alignItems='center'>
                    <Spacer width='15' height='50' />
                    <img src="/img/icon/information.svg" css={iconStyle} alt='お知らせアイコン' />
                    <Spacer width='20' height='50' />
                    <PlainText color='var(--soft-white)' size='15'>{dialog.title || 'お知らせ'}</PlainText>
                  </Flex>
                </Container>
              </div>
              <div css={bodyStyle}>
                <PlainText color='var(--border-dark-gray)' size='16'>{dialog.message}</PlainText>
                {dialog.skipConfirmNextTimeKey &&
                  <>
                    <Spacer height='30' />
                    <Checkbox id='skipConfirmNextTime' size='14' borderColor='gray' checkColor='gray' ref={skipConfirmRef}>
                      <PlainText color='gray' size='12'>次回から確認しない</PlainText>
                    </Checkbox>
                  </>
                }
              </div>
              <Flex justifyContent='space-around'>
                {dialog.canDismiss && <DismissButton onClick={dismissDialog} isProcessing={isProcessing} name={dialog.dismissName} />}
                {!!dialog.callback && <ConfirmButton onClick={handleConfirm} isProcessing={isProcessing} name={dialog.callbackName} />}
              </Flex>
            </div>
          </FullscreenContainer>
        </div>
      }
    </>
  )
}

const dialogStyle = ({
  backgroundColor: 'white',
  borderRadius: '5px',
  filter: 'drop-shadow(2px 2px 5px gray)',
  width: '70%',
  maxWidth: '500px',
  minHeight: '300px',
  maxheight: '80%',
  margin: 'auto',
  marginTop: '5%',
})

const headerStyle = css({
  backgroundColor: 'var(--dark-gray)',
})

const iconStyle = css({
  width: 'auto',
  height: '24px',
})

const bodyStyle = css({
  width: '80%',
  maxWidth: '650px',
  minHeight: '130px',
  maxHeight: '200px',
  margin: '10% auto auto',
})