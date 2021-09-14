/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { css } from '@emotion/core'
import AlignContainer from '../alignContainer'
import PlainText from '../plainText'

export default function LabelLink({ label, target }) {
  return (
    <Link href={target} passHref>
      <a>
        <div css={[linkStyle, linkHoverStyle]}>
          <AlignContainer textAlign='center' verticalAlign='middle'>
            <PlainText color='#848484' fontWeight='300' lineHeight='60' letterSpacing='1'>
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
      </a>
    </Link>
  )
}

const linkStyle = css({
  display: 'inline-block',
  cursor: 'pointer',
  textDecoration: 'none',
})

const linkHoverStyle = css({
  width: '180px',
  textAlign: 'center',
  '::after': {
    display: 'block',
    content: '""',
    paddingTop: '-12px',
    height: '1px',
  },
  ':hover::after': {
    backgroundColor: 'var(--dark-purple)',
    opacity: 0.7,
  },
})