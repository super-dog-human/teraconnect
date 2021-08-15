/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ContainerSpacer from '../../../containerSpacer'
import DrawingPreview from './drawingPreview'
import KindIcon from './kindIcon'
import ActionLabel from './actionLabel'
import EditIcon from './editIcon'

export default function LessonLineDrawing({ drawings, drawing, index, isEditButtonShow, handleEditClick, isLineProcessing }) {
  function handleEditButtonClick(e) {
    handleEditClick(e, 'drawing', index, drawing)
  }

  return (
    <>
      {drawing.action !== 'draw' && <KindIcon kind="drawing" />}
      <div css={drwaingContainerStyle}>
        {drawing.action === 'draw' && <DrawingPreview drawings={drawings} drawing={drawing} sameTimeIndex={index} />}
        {drawing.action !== 'draw' && <ActionLabel kind="drawing" action={drawing.action} />}
      </div>
      <ContainerSpacer top='20'>
        <EditIcon isShow={isEditButtonShow} onClick={handleEditButtonClick} isProcessing={isLineProcessing} />
      </ContainerSpacer>
    </>
  )
}

const drwaingContainerStyle = css({
  width: '100%',
})