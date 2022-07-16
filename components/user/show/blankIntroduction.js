/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import Aspect16To9Container from '../../aspect16To9Container'
import PlainText from '../../plainText'

const BlankIntroduction = () => (
  <>
    <Aspect16To9Container>
      <div css={bodyStyle}>
        <PlainText color='var(--soft-white)' size='16'>
          自己紹介はありません。
        </PlainText>
      </div>
    </Aspect16To9Container>
  </>
)

export default BlankIntroduction

const bodyStyle = css({
  position: 'absolute',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  top: 0,
  width: '100%',
  height: '100%',
  backgroundColor: 'gray',
})