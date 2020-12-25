/** @jsxImportSource @emotion/react */
import React from 'react'
import { jsx, css } from '@emotion/core'
import Link from 'next/link'

const bodyStyle = css({
  width: '100%',
  height: '920px',
  backgroundColor: 'var(--dark-blue)'
})

const copyFotTeacherStyle = css({
  maxWidth: '1280px',
  paddingTop: '90px',
  marginLeft: 'auto',
  marginRight: 'auto',
  color: 'white'
})

const mainCopyStyle = css({
  marginLeft: '70px',
  fontSize: '25px',
  letterSpacing: '1px'
})
const subCopyStyle = css({
  marginTop: '55px',
  marginBottom: '110px',
  fontSize: '18px'
})

const authoringImageStyle = css({
  marginLeft: '50px',
  width: '487px',
  height: '277px'
})

const featuresStyle = css({
  marginTop: '20px',
  marginLeft: '70px'
})

const featureImageStyle = css({
  marginBottom: '80px'
})

const featureTitleStyle = css({
  marginLeft: '20px',
  fontSize: '16px'
})

const featureBodyStyle = css({
  marginLeft: '20px',
  marginTop: '10px',
  width: '230px',
  fontSize: '14px',
  lineHeight: '25px'
})

const createLessonButtonStyle = css({
  marginTop: '120px',
  width: '170px',
  height: '55px',
  backgroundColor: 'white',
  color: 'var(--dark-purple)',
  fontSize: '18px'
})

const CopyForTeacher = () => (
  <div css={bodyStyle}>
    <div css={copyFotTeacherStyle}>
      <div css={mainCopyStyle}>光を。</div>
      <hr size="1" color="white" width="100%" />
      <div className="text-align-center" css={subCopyStyle}>
        今夜、あなたの部屋から。
      </div>
      <div className="flex">
        <div className="displayFlexNone" css={authoringImageStyle}>
          <img
            src="/img/pc_authoring.png"
            alt="Webブラウザで簡単に授業を作成・編集できるよ"
          />
        </div>

        <div className="displayFlexNone" css={featuresStyle}>
          <div className="flex">
            <img
              src="/img/yeti.png"
              width="80px"
              height="80px"
              css={featureImageStyle}
              alt="雪男のアバターでも、岩でも、何にでもなれるよ"
            />
            <div>
              <div css={featureTitleStyle}>アバターで自由な姿に</div>
              <div css={featureBodyStyle}>
                VRMファイルのアップロードで、
                <br />
                どんな姿にも。
              </div>
            </div>
            <img
              src="/img/microphone.png"
              width="80px"
              height="80px"
              css={featureImageStyle}
              alt="マイクを使って声を吹き込もう"
            />
            <div>
              <div css={featureTitleStyle}>声に想いをのせて</div>
              <div css={featureBodyStyle}>
                肉声のほか、自動音声も使用可能。
                <br />
                文章単位で録り直しも。
              </div>
            </div>
          </div>
          <div className="flex">
            <img
              src="/img/chat.png"
              width="77px"
              height="77px"
              alt="仲間と話し合おう"
            />
            <div>
              <div css={featureTitleStyle}>仲間に相談しよう</div>
              <div css={featureBodyStyle}>フォーラムで意見を交換しよう。</div>
            </div>
            <img
              src="/img/yen.png"
              width="75px"
              height="75px"
              alt="お金はかからないよ"
            />
            <div>
              <div css={featureTitleStyle}>無料で作ろう</div>
              <div css={featureBodyStyle}>
                サービスは完全無料。
                <br />
                高性能PCや動画編集ソフトも不要。
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-align-center">
        <Link href="/">
          <a>詳しく見る</a>
        </Link>
      </div>
    </div>
  </div>
)

export default CopyForTeacher
