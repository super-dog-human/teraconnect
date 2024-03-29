/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Container from '../../../container'
import ContainerSpacer from '../../../containerSpacer'
import Flex from '../../../flex'
import LoadingIndicator from '../../../loadingIndicator'

export default function KindButton({ kind, isLoading, isPlaying, status, onClick }) {
  const imageStyle = css({
    cursor: 'pointer',
    width: '20px',
    filter: status ? isPlaying ? 'contrast(300%)' : 'grayscale(0)' : 'grayscale(1) brightness(180%)',
    ':hover': {
      opacity: status ? '0.8' : '1',
    },
  })

  return (
    <ContainerSpacer left='10' right='15'>
      <Flex>
        {isLoading && <Container width='20' height='20'><LoadingIndicator size='100'/></Container>}
        {!isLoading && <Container width='20' height='20'><img src={`/img/icon/timeline-${kind}.svg`} css={imageStyle} onClick={onClick} draggable={false} alt={`${kind}ボタン`} /></Container>}
      </Flex>
    </ContainerSpacer>
  )
}