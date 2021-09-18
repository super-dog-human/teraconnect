/** @jsxImportSource @emotion/react */
import React, { useState } from 'react'
import { css } from '@emotion/core'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import AlignContainer from '../../alignContainer'
import PlainText from '../../plainText'
import ContainerSpacer from '../../containerSpacer'
import ExpandContainer from '../../transition/expandContainer'
import Spacer from '../../spacer'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'

export default function Transcription({ speeches }) {
  const [isExpand, setIsExpand] = useState(false)

  function handleExpandClick() {
    setIsExpand(s => !s)
  }

  return (
    <div css={containerStyle}>
      <AlignContainer textAlign='right'>
        <button css={expandButtonStyle} onClick={handleExpandClick}>
          <PlainText size='12' color='gray'>{isExpand ? '閉じる' : '展開'}</PlainText>
        </button>
      </AlignContainer>
      <div css={bodyStyle}>
        <ExpandContainer isExpand={isExpand} initialHeight='100px' expandedHeight='500px'>
          {speeches.map((speech, i) => (
            <div key={i} css={lineStyle}>
              <Flex>
                <FlexItem flexBasis='50px'>
                  <ContainerSpacer right='40'>
                    <PlainText size='14' lineHeight='14' color='var(--text-gray)' letterSpacing='1'>
                      {floatSecondsToMinutesFormat(speech.elapsedTime)}
                    </PlainText>
                  </ContainerSpacer>
                </FlexItem>
                <PlainText size='14' lineHeight='14' color='var(--text-gray)'>
                  {speech.subtitle}
                </PlainText>
              </Flex>
            </div>
          ))}
          <Spacer height='10' />
        </ExpandContainer>
      </div>
    </div>
  )
}

const containerStyle = css({
  marginTop: '-20px',
})

const bodyStyle = css({
  border: '1px solid var(--border-gray)',
  padding: '10px 20px',
  overflowX: 'hidden',
  overflowY: 'scroll',
})

const lineStyle = css({
  marginTop: '5px',
  marginBottom: '5px',
})

const expandButtonStyle = css({
  border: 'none',
  padding: 0,
  marginRight: '5px',
})