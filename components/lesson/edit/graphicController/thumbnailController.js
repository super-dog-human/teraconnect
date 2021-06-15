/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import Flex from '../../../flex'
import Container from '../../../container'
import IconButton from '../../../button/iconButton'
import GraphicThumbnail from '../graphicThumbnail'
import AbsoluteContainer from '../../../absoluteContainer'
import { useContextMenuContext } from '../../../../libs/contexts/contextMenuContext'
import { useImageViewerContext } from '../../../../libs/contexts/imageViewerContext'

export default function ThumbnailController({ graphicID, graphic, swapGraphic, removeGraphic }) {
  const { setContextMenu } = useContextMenuContext()
  const { setImage } = useImageViewerContext()
  const [isButtonShow, setIsButtonShow] = useState(false)

  function handleEnter() {
    if (graphic.isUploading) return
    setIsButtonShow(true)
  }

  function handleLeave() {
    setIsButtonShow(false)
  }

  function handleMenuClick(e) {
    setContextMenu({
      labels: ['差し替え', '削除'],
      actions: [() => swapGraphic(graphicID), () => removeGraphic(graphicID)],
      position: { fixed: false, x: e.pageX, y: e.pageY },
    })

    e.stopPropagation()
  }

  function handleThumbnailClick(e) {
    if (graphic.isUploading) return

    const url = e.currentTarget.dataset.url
    setImage({ url, widePer: 70 })
  }

  return (
    <div css={bodyStyle} data-url={graphic.url} onMouseOver={handleEnter} onMouseLeave={handleLeave} onClick={handleThumbnailClick}>
      <Container width='185' height='100'>
        <Flex justifyContent='center'>
          <GraphicThumbnail url={graphic.url} isProcessing={graphic.isUploading} />
        </Flex>
      </Container>
      {isButtonShow && <AbsoluteContainer right='3px' bottom='5px'>
        <Container width='22' height='22'>
          <IconButton name='more' onMouseDown={handleMenuClick} />
        </Container>
      </AbsoluteContainer>}
    </div>
  )
}

const bodyStyle = css({
  position: 'relative',
  cursor: 'pointer',
})