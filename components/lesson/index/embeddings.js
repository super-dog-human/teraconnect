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
    <Flex flexWrap='wrap' gap='30px 30px'>
      {embeddings.filter(e => e.action === 'show').map((embedding, i) => {
        const iframeURL = embedding.serviceName === 'youtube' ?
          `https://www.youtube.com/embed/${embedding.contentID}?autoplay=0` :
          `https://www.geogebra.org/material/iframe/id/${embedding.contentID}`
        const linkURL = embedding.serviceName === 'youtube' ?
          `https://www.youtube.com/watch?v=${embedding.contentID}` :
          `https://www.geogebra.org/m/${embedding.contentID}`

        return (
          <div css={iframeStyle} key={i}>
            {embedding.serviceName === 'youtube' &&
              <>
                <iframe id="ytplayer" type="text/html" width="300" height="169" src={iframeURL} frameBorder="0" />
                <a href={linkURL} target='_blank' rel="noreferrer">
                  <Flex justifyContent='right'>
                    <Container width='15' height='15'><Icon name='foreign-gray' /></Container>
                    <Spacer width='8' />
                    <PlainText size='14' color='gray'>YouTube</PlainText>
                  </Flex>
                </a>
              </>
            }
            {embedding.serviceName === 'geogebra' &&
              <>
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
              </>
            }
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