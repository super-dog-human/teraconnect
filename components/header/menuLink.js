/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Container from '../container'
import AlignContainer from '../alignContainer'
import PageLink from '../pageLink'
import ColorFilter from '../colorFilter'

export default function MenuLink({ isHover, isCurrent, path, children }) {
  return (
    <>
      {isCurrent &&
        <div css={isHover ? null : underLineStyle }>
          <Container width='150' height='60'>
            <AlignContainer textAlign='center'>
              {children}
            </AlignContainer>
          </Container>
        </div>
      }
      {!isCurrent &&
        <PageLink path={path}>
          <div css={hoverUnderLineStyle}>
            <Container width='150' height='60'>
              <AlignContainer textAlign='center'>
                <ColorFilter opacity='1' hoverOpacity='1'>
                  {children}
                </ColorFilter>
              </AlignContainer>
            </Container>
          </div>
        </PageLink>
      }
    </>
  )
}

const underLineStyle = css({
  '::after': {
    display: 'block',
    content: '""',
    backgroundColor: 'gray',
    marginTop: '-15px',
    height: '1px',
  },
})
const hoverUnderLineStyle = css({
  ':hover:after': {
    display: 'block',
    content: '""',
    backgroundColor: 'gray',
    marginTop: '-15px',
    height: '1px',
  }
})