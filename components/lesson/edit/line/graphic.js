/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ContainerSpacer from '../../../containerSpacer'
import Spacer from '../../../spacer'
import KindIcon from './kindIcon'
import ActionLabel from './actionLabel'
import GraphicThumbnail from '../graphicThumbnail'
import EditIcon from './editIcon'

export default function LessonLineGraphic({ graphic, index, isEditButtonShow, handleEditClick }) {
  function handleEditButtonClick(e) {
    e.stopPropagation()
    handleEditClick(e, 'graphic', index, graphic)
  }

  return (
    <>
      {graphic.action === 'show' && <Spacer width='15' />}
      {graphic.action !== 'show' && <KindIcon kind="graphic" />}
      <div css={graphicContainerStyle}>
        {graphic.action === 'show' &&
          <ContainerSpacer top='20' bottom='20'>
            <GraphicThumbnail url={graphic.url} />
          </ContainerSpacer>
        }
        {graphic.action === 'hide' && <ActionLabel kind="graphic" action={'hide'} />}
      </div>
      <ContainerSpacer top='20'>
        <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} />
      </ContainerSpacer>
    </>
  )
}

const graphicContainerStyle = css({
  width: '100%',
})