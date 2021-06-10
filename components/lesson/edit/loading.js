/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react'
import { css } from '@emotion/core'
import Container from '../../container'
import Flex from '../../flex'
import Spacer from '../../spacer'
import AlignContainer from '../../alignContainer'
import FullscreeenContainer from '../../fullscreenContainer'
import LoadingIndicator from '../../loadingIndicator'
import PlainText from '../../plainText'
import { pickFromArray } from '../../../libs/utils'

const maxims = [
  { body: '教えるとは、希望を語ること', author: 'Louis Aragon', source: 'Chanson de l\'Université de Strasbourg' },
]

export default function Loading({ isShow }) {
  const randomMaximRef = useRef(pickFromArray(maxims))

  return (
    <FullscreeenContainer position='fixed' zKind='indicator' isShow={isShow}>
      <div css={bodyStyle}>
        <Spacer height='230'/>
        <Flex justifyContent='center'>
          <Container width='170' height='170'>
            <LoadingIndicator size='100' />
          </Container>
        </Flex>
        <Spacer height='200'/>
        <PlainText color='#797979' fontFamily='serif'>
          <AlignContainer textAlign='center'>
            <PlainText size='30'>〝{randomMaximRef.current.body}〟</PlainText>
          </AlignContainer>
          <AlignContainer textAlign='center'>
            <PlainText size='18'>{randomMaximRef.current.author}</PlainText>
          </AlignContainer>
          <Spacer height='20' />
          <AlignContainer textAlign='center'>
            <PlainText size='12'>{randomMaximRef.current.source} より</PlainText>
          </AlignContainer>
        </PlainText>
      </div>
    </FullscreeenContainer>
  )
}

const bodyStyle = css({
  width: '100%',
  height: '100%',
  backgroundColor: 'white',
})