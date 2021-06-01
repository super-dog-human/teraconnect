/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Flex from '../../../../flex'
import FlexItem from '../../../../flexItem'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import GraphicThumbnail from '../../graphicThumbnail'

export default function Thumbnails({ config, graphicURLs, onClick }) {
  const bodyStyle = css({
    overflowX: 'scroll',
    height: '100%',
    visibility: config.action === 'show' ? 'visible' : 'hidden',
  })

  const notSelectedStyle = css({
    cursor: 'pointer',
    margin: '10px',
  })

  const selectedStyle = css({
    cursor: 'pointer',
    margin: '7px',
    border: '3px solid var(--soft-white)',
  })

  return (
    <div css={bodyStyle}>
      <Flex flexWrap='wrap' justifyContent='space-evenly'>
        {Object.keys(graphicURLs).map(id => (
          <div key={id} css={config.graphicID === parseInt(id) ? selectedStyle : notSelectedStyle} data-graphic-id={id} onClick={onClick}>
            <GraphicThumbnail url={graphicURLs[id].url} />
          </div>
        ))}
        {[...Array(3 - Object.keys(graphicURLs).length % 3)].map((_, i) => (
          <ContainerSpacer key={i} top='10' left='10' right='10' bottom='10'>
            <Container width='175'>
              <FlexItem column='3' />
            </Container>
          </ContainerSpacer>
        ))}
      </Flex>
    </div>
  )
}