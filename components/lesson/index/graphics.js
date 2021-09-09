/** @jsxImportSource @emotion/react */
import React, { Fragment } from 'react'
import { css } from '@emotion/core'
import GraphicThumbnail from '../graphicThumbnail'
import Container from '../../container'
import Flex from '../../flex'
import { useImageViewerContext } from '../../../libs/contexts/imageViewerContext'

export default function Graphics({ graphics, graphicURLs }) {
  const { setImage } = useImageViewerContext()

  function handleClick(e) {
    const url = e.currentTarget.dataset.url
    if (!url) return
    setImage({ url, widePer: 70 })
  }

  return (
    <Flex alignContent='flex-start' flexWrap='wrap' gap='10px 0px'>
      {Array.from(new Set(graphics.filter(g => g.action === 'show').map(g => g.graphicID))).map((id, i) => {
        const url = graphicURLs[id]
        return (
          <Fragment key={i}>
            <Container width='185' height='100'>
              <Flex justifyContent='center'>
                <button css={bodyStyle} data-url={url} onClick={handleClick}>
                  <GraphicThumbnail url={url} isProcessing={!url} />
                </button>
              </Flex>
            </Container>
          </Fragment>
        )
      })}
    </Flex>
  )
}

const bodyStyle = css({
  position: 'relative',
  cursor: 'pointer',
  border: 'none',
  padding: 0,
  marginLeft: '10px',
  marginRight: '10px',
})