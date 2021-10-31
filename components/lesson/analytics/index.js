/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Header from '../../authoringHeader'
import Spacer from '../../spacer'
import PlainText from '../../plainText'

export default function LessonAnalytics({ lessonID }) {
  return (
    <>
      <Header currentPage='analytics' />
      <main css={mainStyle}>
        <div css={bodyStyle}>
          <Spacer height='70' />
          <PlainText color='gray'>レポートはありません。</PlainText>
        </div>
      </main>
    </>
  )
}

const mainStyle = css({
  backgroundColor: 'var(--bg-light-gray)',
  userSelect: 'none',
})

const bodyStyle = css({
  margin: 'auto',
  marginTop: '60px', // ヘッダ分をオフセット
  maxWidth: '900px',
  height: '100%',
})