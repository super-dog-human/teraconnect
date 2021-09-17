/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import useMobileDetector from '../../libs/hooks/useMobileDetector'
import Flex from '../flex'
import Container from '../container'
import AlignContainer from '../alignContainer'
import Spacer from '../spacer'
import PlainText from '../plainText'
import ContainerSpacer from '../containerSpacer'
import PageLink from '../pageLink'
import LabelButton from '../button/labelButton'

const AppCopy = () => {
  const isMobile = useMobileDetector()

  return (
    <div css={containerStyle}>
      <div css={bodyStyle}>
        <Spacer height='90' />
        <Flex justifyContent='center' flexWrap='wrap' gap='20px'>
          <ContainerSpacer top='0' left='10' right='10'>
            <Container width='300' height='340'>
              <img src="/img/telescope.png" css={imageStyle} alt="闇の中から光を探す望遠鏡。きみの好きな星が見つかるといい。" />
            </Container>
          </ContainerSpacer>
          <div>
            <PlainText color='var(--text-gray)'>
              {isMobile &&
                <>
                  <Spacer height='20' />
                  <AlignContainer textAlign='center'>
                    <PlainText size='30' fontWeight='500' whiteSpace='nowrap' textShadow='-5px -2px 10px #cccccc'>
                      「知りたい」は消えない。
                    </PlainText>
                  </AlignContainer>
                </>
              }
              {!isMobile &&
                <PlainText size='40' fontWeight='500' letterSpacing='5' whiteSpace='nowrap' textShadow='-5px -2px 10px #cccccc'>
                  「知りたい」は消えない。
                </PlainText>
              }
              {isMobile &&
                <>
                  <Spacer height='20' />
                  <Flex justifyContent='center'>
                    <PlainText size='14' lineHeight='40' letterSpacing={!isMobile && 2} whiteSpace='nowrap'>
                      <div>誰も教えてくれなくても。必要ないと言われても。</div>
                      <div>きみから「知りたい」がなくなることはない。</div>
                      <div>あのとき探した光はまだ、夜空に輝いている。</div>
                    </PlainText>
                  </Flex>
                </>
              }
              {!isMobile &&
                <ContainerSpacer top='30' left='70' right='30'>
                  <PlainText size='14' lineHeight='50' letterSpacing={!isMobile && 2} whiteSpace='nowrap'>
                    <div>誰も教えてくれなくても。必要ないと言われても。</div>
                    <div>きみから「知りたい」がなくなることはない。</div>
                    <div>あのとき探した光はまだ、夜空に輝いている。</div>
                  </PlainText>
                </ContainerSpacer>
              }
              <ContainerSpacer top={isMobile ? 40 : 0} left='30' right='30' bottom='60'>
                <Flex justifyContent='center'>
                  <Container width='170' height='55'>
                    <PageLink path='/search'>
                      <LabelButton fontSize='18' color='white' backgroundColor='var(--light-powder-blue)'>授業をさがす</LabelButton>
                    </PageLink>
                  </Container>
                </Flex>
              </ContainerSpacer>
            </PlainText>
          </div>
        </Flex>
      </div>
    </div>
  )
}

const containerStyle = css({
  width: '100%',
  minHeight: '530px',
  backgroundColor: 'var(--bg-light-gray)',
  display: 'flex',
  justifyContent: 'center',
})

const bodyStyle = css({
  width: '100%',
  maxWidth: '1280px',
  textSizeAdjust: 'none',
})

const imageStyle = css({
  width: '300px',
  height: '340px',
  objectFit: 'contain',
})

export default AppCopy
