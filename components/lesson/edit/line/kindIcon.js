/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ContainerSpacer from '../../../containerSpacer'
import Flex from '../../../flex'

export default function KindIcon({ kind, onClick }) {
  const imageStyle = css({
    width: '20px',
  })

  return (
    <ContainerSpacer left='10' right='15'>
      <Flex>
        <img src={`/img/icon/timeline-${kind}.svg`} css={imageStyle} onClick={onClick} draggable={false} />
      </Flex>
    </ContainerSpacer>
  )
}