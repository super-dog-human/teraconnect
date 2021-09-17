/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import Spacer from '../../spacer'
import Container from '../../container'
import UserIcon from '../../userIcon'
import PlainText from '../../plainText'
import MultilineText from '../../multilineText'
import { formatDate } from '../../../libs/utils'

export default function Description({ lesson }) {
  return (
    <div css={containerStyle}>
      <Flex>
        <FlexItem flexBasis='30%'>
          <Flex>
            <FlexItem flexBasis='73px'>
              <Container width='73' height='73'>
                <UserIcon id={lesson?.author.id} name={lesson?.author.name} />
              </Container>
            </FlexItem>
            <Spacer width='20' />
            <div>
              <PlainText size='18' color='gray'>{lesson?.title}</PlainText><br />
              <PlainText size='13' color='darkgray'>{lesson && formatDate(new Date(lesson?.published)) + ' 更新'}</PlainText>
            </div>
          </Flex>
        </FlexItem>
        <Spacer width='20' />
        <FlexItem>
          <PlainText size='13' color='gray'>
            {lesson && <MultilineText texts={lesson?.description} />}
          </PlainText>
        </FlexItem>
      </Flex>
    </div>
  )
}

const containerStyle = css({
  marginTop: '30px',
  marginLeft: '20px',
  marginBottom: '20px',
})