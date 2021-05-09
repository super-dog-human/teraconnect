/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ContainerSpacer from '../../../containerSpacer'
import Flex from '../../../flex'

export default function KindIcon({ kind, status=true, onClick }) {
  const imageStyle = css({
    width: '20px',
    filter: status ? 'grayscale(0)' : 'grayscale(1) brightness(130%)',
  })

  return (
    <ContainerSpacer left='20' right='15'>
      <Flex>
        <img src={`/img/icon/timeline-${kind}.svg`} css={imageStyle} onClick={onClick} draggable={false} />
      </Flex>
    </ContainerSpacer>
  )
}