/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Container from '../../../container'
import ContainerSpacer from '../../../containerSpacer'
import KindIcon from './kindIcon'
import ActionLabel from './actionLabel'
import GraphicThumbnail from '../graphicThumbnail'
import EditIcon from './editIcon'
import { useImageViewerContext } from '../../../../libs/contexts/imageViewerContext'
import { useLessonEditorContext } from '../../../../libs/contexts/lessonEditorContext'

export default function LessonLineGraphic({ graphic, index, isEditButtonShow, handleEditClick, isLineProcessing }) {
  const { setImage } = useImageViewerContext()
  const { graphicURLs } = useLessonEditorContext()

  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'graphic', index, graphic)
  }

  function handleThumbnailClick(e) {
    const url = e.currentTarget.dataset.url
    setImage({ url, widePer: 70 })
  }

  return (
    <>
      {graphic.action !== 'show' && <KindIcon kind="graphic" />}
      <div css={graphicContainerStyle}>
        {graphic.action === 'show' &&
          <ContainerSpacer left='10' top='20' bottom='20'>
            <Container width='175' height='100'>
              <div data-url={graphicURLs[graphic.graphicID]?.url} onClick={handleThumbnailClick}>
                <GraphicThumbnail url={graphicURLs[graphic.graphicID]?.url} />
              </div>
            </Container>
          </ContainerSpacer>
        }
        {graphic.action === 'hide' && <ActionLabel kind="graphic" action={'hide'} />}
      </div>
      <ContainerSpacer top='20'>
        <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} isProcessing={isLineProcessing} />
      </ContainerSpacer>
    </>
  )
}

const graphicContainerStyle = css({
  width: '100%',
})