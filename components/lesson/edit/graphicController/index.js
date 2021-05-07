/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Container from '../../../container'
import AlignContent from '../../../alignContainer'
import Spacer from '../../../spacer'
import ThumbnailController from './thumbnailController'
import InputFile from '../../../form/inputFile'
import Hr from '../../../hr'
import useGraphicController from '../../../../libs/hooks/lesson/edit/useGraphicController'
import { useLessonEditorContext } from '../../../../libs/contexts/lessonEditorContext'
import { useErrorDialogContext } from '../../../../libs/contexts/errorDialogContext'
import { useDialogContext } from '../../../../libs/contexts/dialogContext'

export default function LessonEditGraphicController() {
  const { setGraphics, graphicURLs, setGraphicURLs } = useLessonEditorContext()
  const { showDialog } = useDialogContext()
  const { showError } = useErrorDialogContext()
  const { inputFileRef, selectLocalImage, confirmSwappingGraphic, confirmRemovingGraphic } =
    useGraphicController({ showDialog, showError, setGraphics, setGraphicURLs })

  return (
    <div css={bodyStyle}>
      <Spacer height='70' />
      <Container height='50'>
        <AlignContent textAlign='center'>
          <Hr color='var(--border-gray)' />
        </AlignContent>
      </Container>
      <div css={containerStyle}>
        {Object.keys(graphicURLs).map(graphicID => (
          <div css={thumbnailStyle} key={graphicID}>
            <ThumbnailController graphicID={graphicID} url={graphicURLs[graphicID]} swapGraphic={selectLocalImage} removeGraphic={confirmRemovingGraphic} />
          </div>
        ))}
      </div>
      <div>
        <InputFile accept="image/jpeg,image/png,image/gif" onChange={confirmSwappingGraphic} ref={inputFileRef} />
      </div>
    </div>
  )
}

const bodyStyle = css({
  height: 'calc(100% - 253px - 20px - 45px - 70px)', // 自身の上に存在する要素分を差し引く
})

const containerStyle = css({
  height: 'calc(100% - 50px)',
  overflowX: 'scroll',
  display: 'flex',
  alignContent: 'flex-start',
  flexWrap: 'wrap',
})

const thumbnailStyle = css({
  flex: 'calc(50% - 40px) 0',
  margin: '10px 20px',
})