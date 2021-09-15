/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Flex from '../../flex'
import Container from '../../container'
import AlignContainer from '../../alignContainer'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import Icon from '../../icon'

export default function Embeddings({ embeddings }) {
  return (
    <Flex flexWrap='wrap' gap='50px 30px'>
      {Array.from(new Set(embeddings.filter(e => e.action === 'show' && e.serviceName === 'youtube').map(e => e.contentID))).map((contentID, i) => {
        const iframeURL = `https://www.youtube.com/embed/${contentID}?autoplay=0`
        const linkURL = 'https://www.youtube.com/watch?v=' + contentID

        return (
          <div css={iframeStyle} key={i}>
            <iframe id="ytplayer" type="text/html" width="300" height="169" src={iframeURL} frameBorder="0" />
            <a href={linkURL} target='_blank' rel="noreferrer">
              <Flex justifyContent='right'>
                <Container width='15' height='15'><Icon name='foreign-gray' /></Container>
                <Spacer width='8' />
                <PlainText size='14' color='gray'>YouTube</PlainText>
              </Flex>
            </a>
          </div>
        )
      })}

      {Array.from(new Set(embeddings.filter(e => e.action === 'show' && e.serviceName === 'geogebra').map(e => e.contentID))).map((contentID, i) => {
        const iframeURL = 'https://www.geogebra.org/material/iframe/id/' + contentID
        const linkURL = 'https://www.geogebra.org/m/' + contentID

        return (
          <div css={iframeStyle} key={i}>
            <iframe scrolling="no" width="300px" height="169px" src={iframeURL} frameBorder="0" />
            <AlignContainer textAlign='right'>
              <a href={linkURL} target='_blank' rel="noreferrer">
                <Flex justifyContent='right'>
                  <Container width='15' height='15'><Icon name='foreign-gray' /></Container>
                  <Spacer width='8' />
                  <PlainText size='14' color='gray'>GeoGebra</PlainText>
                </Flex>
              </a>
            </AlignContainer>
          </div>
        )
      })}
    </Flex>
  )
}

const iframeStyle = css({
  width: '300px',
  height: '169px',
})