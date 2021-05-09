/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Container from '../../../container'
import AlignContent from '../../../alignContainer'
import Spacer from '../../../spacer'
import ThumbnailController from './thumbnailController'
import InputFile from '../../../form/inputFile'
import LabelButton from '../../../button/labelButton'
import PlainText from '../../../plainText'
import Flex from '../../../flex'
import Hr from '../../../hr'
import useGraphicController from '../../../../libs/hooks/lesson/edit/useGraphicController'
import useGraphicUploader from '../../../../libs/hooks/lesson/edit/useGraphicUploader'
import { useLessonEditorContext } from '../../../../libs/contexts/lessonEditorContext'
import { useErrorDialogContext } from '../../../../libs/contexts/errorDialogContext'
import { useDialogContext } from '../../../../libs/contexts/dialogContext'

export default function LessonEditGraphicController() {
  const { setGraphics, graphicURLs, setGraphicURLs } = useLessonEditorContext()
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()
  const { inputFileRef, selectLocalImage, confirmSwappingGraphic, confirmRemovingGraphic } = useGraphicController({ showDialog, showError, setGraphics, setGraphicURLs })
  const { graphicContainerRef, inputMultiFileRef, handleFileChange, handleUploadButtonClick, handleDragOver, handleDrop } = useGraphicUploader({ graphicURLs, setGraphicURLs })

  return (
    <div css={bodyStyle} onDragOver={handleDragOver} onDrop={handleDrop}>
      <Spacer height='70' />
      <Container height='20'>
        <AlignContent textAlign='center'>
          <Hr color='var(--border-gray)' />
        </AlignContent>
      </Container>
      <div css={containerStyle} ref={graphicContainerRef}>
        {Object.keys(graphicURLs).map(graphicID => (
          <div css={thumbnailStyle} key={graphicID}>
            <ThumbnailController graphicID={graphicID} graphic={graphicURLs[graphicID]} swapGraphic={selectLocalImage} removeGraphic={confirmRemovingGraphic} />
          </div>
        ))}
      </div>
      <div css={uploaderButton}>
        <LabelButton color='white' backgroundColor='var(--dark-purple)' onClick={handleUploadButtonClick}>
          <Flex justifyContent='center' alignItems='center'>
            <img src="/img/icon/photo-upload.svg" css={uploadIconStyle} />
            <Spacer width='15' />
            <PlainText size='14'>画像アップロード</PlainText>
          </Flex>
          <InputFile accept="image/jpeg,image/png,image/gif" multiple={true} onChange={handleFileChange} ref={inputMultiFileRef} />
        </LabelButton>
      </div>
      <div>
        <InputFile accept="image/jpeg,image/png,image/gif" onChange={confirmSwappingGraphic} ref={inputFileRef} />
      </div>
    </div>
  )
}

const bodyStyle = css({
  height: 'calc(100% - 253px - 20px - 45px)', // プレビューエリアと収録時間の高さと余白を差し引く
})

const containerStyle = css({
  height: 'calc(100% - 70px - 20px - 20px - 45px)', // 水平線・アップロードボタンの高さと余白を差し引く
  overflowX: 'scroll',
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
})

const thumbnailStyle = css({
  flex: 'calc(50% - 40px) 0',
  margin: '15px 20px',
})

const uploaderButton = css({
  width: '100%',
  height: '45px',
  marginTop: '20px',
})

const uploadIconStyle = css({
  width: '32px',
})