/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import { useRouter } from 'next/router'
import Spacer from './spacer'
import PlainText from './plainText'
import Container from './container'
import ContainerSpacer from './containerSpacer'
import AlignContainer from './alignContainer'
import Flex from './flex'
import FlexItem from './flexItem'
import PageLink from './pageLink'
import LabelButton from './button/labelButton'

export default function About({ isShowNavigate }) {
  const router = useRouter()

  return (
    <div css={bodyStyle}>
      <ContainerSpacer left='50' right='50'>
        <Spacer height='100' />

        <div>
          <PlainText size='35'>
            TERACONNECTで、できること。
          </PlainText>
        </div>

        <Spacer height='50' />

        <div>
          <PlainText size='18'>
            TERACONNECTは、PCやタブレットで簡単に授業が作成・閲覧できる、授業公開プラットフォームです。
          </PlainText>
        </div>

        <Spacer height='100' />


        <Flex justifyContent='start-end' gap='50px'>
          <FlexItem flexBasis='70%'>
            <div css={textStyle}>
              <div>
                <AlignContainer textAlign='right'>
                  <PlainText size='45' whiteSpace='nowrap'>
                    とどける。
                  </PlainText>
                </AlignContainer>
                <Spacer height='30' />
                <Flex justifyContent='right'>
                  <PlainText size='15'>
                    動画の1/10以下の通信量を実現し、PCやスマートフォンなどを使って<br />
                    誰もが学習手段へアクセスできる環境を目指しています。
                  </PlainText>
                </Flex>
              </div>
            </div>
          </FlexItem>
          <FlexItem flexBasis='30%'>
            <img src='/img/gift.webp' srcSet="/img/gift.webp 1x, /img/gift@2x.webp 2x" css={imageStyle} alt='プレゼント' />
          </FlexItem>
        </Flex>

        <Spacer height='150' />

        <Flex gap='50px'>
          <FlexItem flexBasis='25%'>
            <img src='/img/statue.webp' srcSet="/img/statue.webp 1x, /img/statue@2x.webp 2x" css={imageStyle} alt='あなたの記念碑' />
          </FlexItem>
          <FlexItem flexBasis='75%'>
            <div css={leftAlignStyle}>
              <div>
                <AlignContainer textAlign='left'>
                  <PlainText size='45' whiteSpace='nowrap'>
                    のこす。
                  </PlainText>
                </AlignContainer>
                <Spacer height='30' />
                <ContainerSpacer left='5'>
                  <Flex justifyContent='right'>
                    <PlainText size='15'>
                      輝くようなあなたの知性も、時を経て消えてしまいます。<br />
                      あなたにしかできない授業を、次の世代へ<ruby>書庫<rp>(</rp><rt>アーカイブ</rt><rp>)</rp></ruby>しませんか。
                    </PlainText>
                  </Flex>
                </ContainerSpacer>
              </div>
            </div>
          </FlexItem>
        </Flex>

        <Spacer height='150' />

        <Flex justifyContent='center' gap='50px'>
          <FlexItem>
            <img src='/img/heart.webp' srcSet="/img/heart.webp 1x, /img/heart@2x.webp 2x" css={imageStyle} alt='きみを守る' />
          </FlexItem>
          <FlexItem>
            <div css={leftAlignStyle}>
              <div>
                <AlignContainer textAlign='left'>
                  <PlainText size='45' whiteSpace='nowrap'>
                    まもる。
                  </PlainText>
                </AlignContainer>
                <Spacer height='30' />
                <ContainerSpacer left='10'>
                  <Flex justifyContent='right'>
                    <PlainText size='15'>
                      学校で不当に傷つけられてしまう人たちのために、<br />
                      自分に合った、勉強を諦めなくてもいい場所を提供します。
                    </PlainText>
                  </Flex>
                </ContainerSpacer>
              </div>
            </div>
          </FlexItem>
        </Flex>

        <Spacer height='150' />

        {isShowNavigate &&
          <>
            <Flex justifyContent='space-between'>
              <Container width='150' height='45'>
                <LabelButton fontSize='15' lineHeight='45' color='var(--text-dark-gray)' borderColor='var(--text-dark-gray)' onClick={() => { router.back() }}>
                  もどる
                </LabelButton>
              </Container>

              <PageLink path='/users/edit?sign_up=true'>
                <Container width='150' height='45'>
                  <LabelButton fontSize='15' lineHeight='45' color='white' backgroundColor='var(--dark-purple)'>
                    ユーザー登録
                  </LabelButton>
                </Container>
              </PageLink>
            </Flex>

            <Spacer height='100' />
          </>
        }
      </ContainerSpacer>
    </div>
  )
}

const bodyStyle = css({
  maxWidth: '1280px',
  margin: 'auto',
  color: 'gray',
})

const textStyle = css({
  display: 'flex',
  justifyContent: 'end',
  alignItems: 'center',
  height: '100%',
})

const leftAlignStyle = css({
  display: 'flex',
  alignItems: 'center',
  height: '100%',
})

const imageStyle = css({
  width: '100%',
  height: 'auto',
  maxWidth: '250px',
  maxHeight: '250px',
  objectFit: 'contain',
})