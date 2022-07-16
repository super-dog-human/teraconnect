/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import AlignContainer from '../alignContainer'
import PlainText from '../plainText'

export default function LinkLabel({ label }) {
  return (
    <div css={labelStyle}>
      <AlignContainer textAlign='center' verticalAlign='middle'>
        <PlainText color='var(--text-dark-gray)' fontWeight='300' lineHeight='60' letterSpacing='1'>
          {label.split('').map((char, i) => {
            if (char === 'で' || char === 'す') {
              return <PlainText key={i} size='14'>{char}</PlainText>
            } else if (char === '探') {
              return <PlainText key={i} size='16'>{char}</PlainText>
            } else {
              return <PlainText key={i} size='18'>{char}</PlainText>
            }
          })}
        </PlainText>
      </AlignContainer>
    </div>
  )
}

const labelStyle = css({
  whiteSpace: 'nowrap',
})