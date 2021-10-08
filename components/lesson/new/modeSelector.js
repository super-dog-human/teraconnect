/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import ContainerSpacer from '../../containerSpacer'
import Spacer from '../../spacer'
import AlignContainer from '../../alignContainer'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import PlainText from '../../plainText'
import PageLink from '../../pageLink'
import useTouchDeviceDetector from '../../../libs/hooks/useTouchDeviceDetector'

export default function ModeSelector({ isIntroduction, onClick }) {
  const isTouchDevice = useTouchDeviceDetector()

  return (
    <>
      <Flex justifyContent='center' flexWrap='wrap' gap='30px'>
        <div css={modeSelectorStyle}>
          <button css={selectorContainerStyle} data-type='record' onClick={onClick}>
            <Flex flexDirection='column'>
              <Flex justifyContent=''>
                <FlexItem flexBasis='100px'>
                  <img src="/img/podcast.webp" srcSet="/img/podcast.webp 1x, /img/podcast@2x.webp 2x" width="100px" height="100px" alt="声で収録モード" />
                </FlexItem>
                <FlexItem flexBasis='100%'>
                  <Flex alignItems='center'>
                    <Spacer width='20' height='100' />
                    <AlignContainer textAlign='left'>
                      <div>
                        <PlainText color='var(--soft-white)' size='17'>自分の声を録音する</PlainText>
                      </div>
                      <ContainerSpacer left='20'>
                        <PlainText color='var(--soft-white)' size='27' fontWeight='bold' whiteSpace='nowrap'>収録モード</PlainText>
                      </ContainerSpacer>
                    </AlignContainer>
                  </Flex>
                </FlexItem>
              </Flex>
              <PlainText color='var(--soft-white)' size='16'>
                <div css={listStyle}>・声の録音をリアルタイムで行います。</div>
                <div css={listStyle}>・話しながら図を表示したり、線の描き込みができます。</div>
                <div css={listStyle}>・収録が終わったら、入力編集モードに移動します。</div>
              </PlainText>
            </Flex>
          </button>
        </div>

        <div css={modeSelectorStyle}>
          <div css={selectorContainerStyle}>
            <button css={selectorContainerStyle} data-type='edit' onClick={onClick}>
              <Flex flexDirection='column'>
                <Flex justifyContent=''>
                  <FlexItem flexBasis='100px'>
                    <img src="/img/computer-user.webp" srcSet="/img/computer-user.webp 1x, /img/computer-user@2x.webp 2x" width="100px" height="100px" alt="テキスト入力モード" />
                  </FlexItem>
                  <FlexItem flexBasis='100%'>
                    <Flex alignItems='center'>
                      <Spacer width='20' height='100' />
                      <AlignContainer textAlign='left'>
                        <div>
                          <PlainText color='var(--soft-white)' size='17'>合成音声を使用する</PlainText>
                        </div>
                        <ContainerSpacer left='20'>
                          <PlainText color='var(--soft-white)' size='27' fontWeight='bold' whiteSpace='normal'>入力編集モード</PlainText>
                        </ContainerSpacer>
                      </AlignContainer>
                    </Flex>
                  </FlexItem>
                </Flex>
                <PlainText color='var(--soft-white)' size='16'>
                  <div css={listStyle}>・全ての機能を備えた編集画面です。</div>
                  <div css={listStyle}>・入力したテキストから音声を作成します。<br /><PlainText size='11'>　※音声を個別に録音することも可能です。</PlainText></div>
                  <div css={listStyle}>・テロップやBGM、動画の埋め込みが行えます。</div>
                </PlainText>
              </Flex>
            </button>
          </div>
        </div>
      </Flex>

      {isIntroduction &&
        <>
          <Spacer height='10' />
          <Flex justifyContent='center' flexWrap='wrap' gap={!isTouchDevice && '30px'}>
            <div css={skipContainerStyle} />
            <div css={skipContainerStyle}>
              <Flex justifyContent='flex-end'>
                <PageLink path='/users/dashboard'>
                  <PlainText size='14' color='gray'>スキップ</PlainText>
                </PageLink>
              </Flex>
            </div>
          </Flex>
        </>
      }

      <Spacer height={isTouchDevice ? '10' : '50'} />

      <Flex justifyContent='center'>
        <PageLink path='/' target='_blank'><PlainText color='gray' size='17'>各モードの使い方</PlainText></PageLink>
      </Flex>
    </>
  )
}

const modeSelectorStyle = css({
  maxWidth: '580px',
  width: '100%',
  minHeight: '350px',
  marginLeft: '10px',
  marginRight: '10px',
  borderRadius: '5px',
  backgroundColor: 'var(--dark-purple)',
})

const selectorContainerStyle = css({
  width: '100%',
  height: '100%',
  border: 'none',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

const listStyle = css({
  textAlign: 'left',
  whiteSpace: 'normal',
  marginTop: '20px',
  marginBottom: '20px',
})

const skipContainerStyle = css({
  maxWidth: '580px',
  width: '100%',
  marginLeft: '10px',
  marginRight: '10px',
})