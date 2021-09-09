/** @jsxImportSource @emotion/react */
import React, { useEffect } from 'react'
import { css } from '@emotion/core'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import PlainText from '../../plainText'
import { floatSecondsToMinutesFormat } from '../../../libs/utils'

export default function Transcription({ speeches }) {
  return (
    <div css={containerStyle}>
      {speeches.map((speech, i) => (
        <div key={i} css={lineStyle}>
          <Flex>
            <FlexItem flexBasis='50px'>
              <div css={elapsedTimeStyle}>
                <PlainText size='14' color='var(--text-gray)' letterSpacing='1'>
                  {floatSecondsToMinutesFormat(speech.elapsedTime)}
                </PlainText>
              </div>
            </FlexItem>
            <PlainText size='14' color='var(--text-gray)'>
              {speech.subtitle}
            </PlainText>
          </Flex>
        </div>
      ))}
    </div>
  )
}

const containerStyle = css({
  height: '100px',
  border: '1px solid var(--border-gray)',
  padding: '10px 20px',
  overflowX: 'hidden',
})

const lineStyle = css({
  marginTop: '5px',
  marginBottom: '5px',
})

const elapsedTimeStyle = css({
  marginRight: '40px',
})