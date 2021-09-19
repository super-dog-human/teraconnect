/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useMobileDetector from '../../libs/hooks/useMobileDetector'
import Flex from '../flex'
import FlexItem from '../flexItem'
import Spacer  from '../spacer'
import PageLink from '../pageLink'
import PlainText from '../plainText'
import Container from '../container'
import ContainerSpacer from '../containerSpacer'
import LabelButton from '../button/labelButton'

const CopyForTeacher = () => {
  const isMobile = useMobileDetector()

  return (
    <div css={containerStyle}>
      <div css={bodyStyle}>
        <Spacer height='90'/>

        <ContainerSpacer left='30' right='30'>
          <PlainText size='24' letterSpacing='1' whiteSpace='nowrap'>
            今夜、あなたの部屋から。
          </PlainText>
        </ContainerSpacer>

        <ContainerSpacer left='10' right='10'>
          <hr size="1" color="white" width="100%" />
        </ContainerSpacer>

        <ContainerSpacer left='30' right='30'>
          <PlainText size='14'>
            マイクがなくても大丈夫。PCやタブレットで、すぐに授業を収録しよう。
          </PlainText>
        </ContainerSpacer>

        <Spacer height='50' />

        <Flex justifyContent='center' flexWrap='wrap'>
          <FlexItem flexBasis='40%'>
            <Container>
              <ContainerSpacer left={!isMobile && 20} right={!isMobile && 20} bottom='60'>
                <img src="/img/pc_authoring.png" alt="Webブラウザで簡単に授業を作成・編集" css={authoringImageStyle} />
              </ContainerSpacer>
            </Container>
          </FlexItem>

          <FlexItem flexBasis='60%'>
            <Flex justifyContent='center' flexWrap='wrap' gap='50px'>
              <FlexItem flexBasis='320px'>
                <Flex>
                  <img src="/img/yeti.webp" width="80px" height="80px" alt="雪男でも、岩でも、何にでも" />
                  <Spacer width='30' />
                  <div>
                    <PlainText size='17' whiteSpace='nowrap'>アバターで自由な姿に。</PlainText>
                    <Spacer height='5' />
                    <div>
                      <PlainText size='13' whiteSpace='nowrap'>
                        VRMファイルをアップロードし、<br />
                        好きな姿で教壇に立とう。<br />
                        <PlainText size='10' whiteSpace='nowrap'>
                          ※容量・ポリゴン数の制限があります。
                        </PlainText>
                      </PlainText>
                    </div>
                  </div>
                </Flex>
              </FlexItem>
              <FlexItem flexBasis='320px'>
                <Flex>
                  <img src="/img/microphone.webp" width="80px" height="80px" alt="マイクを使って声を吹き込もう" />
                  <Spacer width='30' />
                  <div>
                    <PlainText size='17' whiteSpace='nowrap'>声に想いをのせよう。</PlainText>
                    <Spacer height='5' />
                    <div>
                      <PlainText size='13' whiteSpace='nowrap'>
                        マイク録音のほか、AI音声を搭載。<br />
                        文章単位の録り直しもかんたん。
                      </PlainText>
                    </div>
                  </div>
                </Flex>
              </FlexItem>
              <FlexItem flexBasis='320px'>
                <Flex>
                  <img src="/img/blackboard.webp" width="80px" height="80px" alt="もっと分かりやすく" />
                  <Spacer width='30' />
                  <div>
                    <PlainText size='17' whiteSpace='nowrap'>動きでもっと伝えよう。</PlainText>
                    <Spacer height='5' />
                    <div>
                      <PlainText size='13' whiteSpace='nowrap'>
                        文字を書き込んだり、YouTubeや<br />
                        GeoGebraを授業内に埋め込んで、<br />
                        さらに分かりやすい授業に。
                      </PlainText>
                    </div>
                  </div>
                </Flex>
              </FlexItem>
              <FlexItem flexBasis='320px'>
                <Flex>
                  <img src="/img/no-fee.webp" width="80px" height="80px" alt="お金はかからないよ" />
                  <Spacer width='30' />
                  <div>
                    <PlainText size='17' whiteSpace='nowrap'>無料で作ろう。</PlainText>
                    <Spacer height='5' />
                    <div>
                      <PlainText size='13' whiteSpace='nowrap'>
                        サービスの利用は完全無料。<br />
                        高性能なPCや編集ソフトも不要。
                      </PlainText>
                    </div>
                  </div>
                </Flex>
              </FlexItem>
            </Flex>
          </FlexItem>
        </Flex>

        <ContainerSpacer top='70' bottom='100'>
          <Flex justifyContent='center'>
            <Container width='170' height='55'>
              <PageLink path='/lessons/new'>
                <LabelButton fontSize='18' color='white' backgroundColor='var(--dark-purple)'>
                  授業をつくる
                </LabelButton>
              </PageLink>
            </Container>
          </Flex>
        </ContainerSpacer>
      </div>
    </div>
  )
}

const containerStyle = css({
  width: '100%',
  backgroundColor: 'var(--dark-blue)',
  display: 'flex',
  justifyContent: 'center',
})

const bodyStyle = css({
  width: '100%',
  maxWidth: '1280px',
  color: 'white'
})

const authoringImageStyle = css({
  width: '100%',
  minWidth: '350px',
  height: 'auto',
  objectFit: 'contain',
})

export default CopyForTeacher
