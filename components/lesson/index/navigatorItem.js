/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/react'
import PageLink from '../../pageLink'
import PlainText from '../../plainText'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import Spacer from '../../spacer'
import AlignContainer from '../../alignContainer'
import NoImage from '../../noImage'

const NavigatorItem = ({ isMobile, isNext, lessonID, otherLessonID, title, thumbnailURL, thumbnailError, onThumbnailError }) => (
  <FlexItem column={isMobile ? '1' : otherLessonID === 0 ? '2' : '2 - 50px'}>
    <ContainerSpacer top={isMobile && !isNext && otherLessonID !== 0 && '20'} bottom={isMobile && isNext && otherLessonID !== 0 && '20'} left={isMobile && '20'} right={isMobile && '20'}>
      <PageLink path={'/lessons/' + lessonID}>
        <Flex alignItems='start'>
          <FlexItem flexBasis='150px'>
            <Container width='150' height='84'>
              {!thumbnailError && <img src={thumbnailURL} alt={title} css={thumbnailStyle} onError={onThumbnailError} />}
              {!!thumbnailError && <NoImage textSize='13' color='var(--soft-white)' backgroundColor='gray' />}
            </Container>
          </FlexItem>
          <Spacer width='15'/>
          <div css={labelStyle}>
            <PlainText size='13' lineHeight='13' color='gray'>
              <AlignContainer verticalAlign='top'>
                {isNext ? '次の授業' : '前の授業'}
              </AlignContainer>
            </PlainText>
            <div css={lessonTitleStyle}>
              {title}
            </div>
          </div>
        </Flex>
      </PageLink>
    </ContainerSpacer>
  </FlexItem>
)

export default NavigatorItem

const thumbnailStyle = css({
  width: '100%',
  height: '100%',
  objectFit: 'contain',
})

const labelStyle = css({
  width: '100%',
  height: '84px',
})

const lessonTitleStyle = css({
  height: '66px',
  marginTop: '5px',
  marginLeft: '5px',
  fontSize: '15px',
  color: 'gray',
  overflow: 'hidden',
})