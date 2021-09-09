import React from 'react'
import Link from 'next/link'
import Flex from '../../flex'
import FlexItem from '../../flexItem'
import Container from '../../container'
import Spacer from '../../spacer'
import PlainText from '../../plainText'
import MultilineText from '../../multilineText'
import UserIcon from '../../userIcon'

export default function Author({ author }) {
  return (
    <Flex>
      <FlexItem flexBasis='73px'>
        <Link href={'/users/' + author.id} passHref>
          <a>
            <Container width='73' height='73'>
              <UserIcon id={author.id} name={author.name} />
            </Container>
          </a>
        </Link>
      </FlexItem>
      <Spacer width='20' />
      <div>
        <PlainText size='15' color='gray'>{author.name}</PlainText><br />
        <PlainText size='13' color='gray'>
          <MultilineText texts={author.profile} />
        </PlainText>
      </div>
    </Flex>
  )
}