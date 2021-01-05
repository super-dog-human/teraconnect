/** @jsxImportSource @emotion/react */
import React from 'react'
import Link from 'next/link'
import { css } from '@emotion/core'

const bodyStyle = css({
  width: '100%',
  height: '680px',
  backgroundColor: 'var(--bg-light-gray)'
})

const appCopyStyle = css({
  maxWidth: '1280px',
  marginLeft: 'auto',
  marginRight: 'auto',
  paddingTop: '115px'
})

const imageStyle = css({
  marginLeft: '124px',
  width: '300px',
  height: '340px'
})

const textCopyStyle = css({
  marginLeft: '75px',
  width: '550px'
})

const largeTextCopyStyle = css({
  fontSize: '40px',
  fontWeight: 500,
  letterSpacing: '5px',
  textShadow: '-5px -2px 10px #cccccc'
})

const smallTextCopyStyle = css({
  marginTop: '70px',
  marginLeft: '30px',
  lineHeight: '50px',
  letterSpacing: '2px'
})

const lookingLessonButtonStyle = css({
  marginTop: '40px',
  width: '170px',
  height: '55px',
  backgroundColor: 'var(--light-powder-blue)',
  color: 'white',
  fontSize: '18px'
})

const AppCopy = () => (
  <div css={bodyStyle}>
    <div css={appCopyStyle} className="flex">
      <div className="displayFlexNone">
        <img
          src="/img/telescope.png"
          css={imageStyle}
          title="望遠鏡"
          alt="闇の中から光を探す望遠鏡。きみの好きな星が見つかるといいな。"
        />
      </div>
      <div className="displayFlexNone color-text-gray" css={[textCopyStyle]}>
        <div css={largeTextCopyStyle}>「知りたい」は消えない。</div>
        <div css={smallTextCopyStyle}>
          <div>誰も教えてくれなくても。丸暗記しろと言われても。</div>
          <div>きみから「知りたい」がなくなることはない。</div>
          <div>あのとき探した光はまだ、夜空に輝いている。</div>
        </div>
      </div>
    </div>
    <div className="text-align-center">
      <Link href="/">
        <button css={lookingLessonButtonStyle}>授業をさがす</button>
      </Link>
    </div>
  </div>
)

export default AppCopy
