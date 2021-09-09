/** @jsxImportSource @emotion/react */
import React, { useState, useEffect, Fragment } from 'react'
import { css } from '@emotion/core'
import Image from 'next/image'
import NoImage from '../../noImage'
import Flex from '../../flex'
import AlignContainer from '../../alignContainer'
import PlainText from '../../plainText'
import Container from '../../container'
import Spacer from '../../spacer'
import { fetchBookFast } from '../../../libs/fetchBook'

const calilBookURL = 'https://calil.jp/book/'

export default function ReferenceBooks({ references }) {
  const [books, setBooks] = useState({})

  useEffect(() => {
    references.forEach(ref => {
      fetchBookFast(ref.isbn).then(book =>  {
        setBooks(books => ({ ...books, [ref.isbn]: book }))
      })
    })
  }, [references])

  return (
    <Flex>
      {references.map((reference, i) => (
        <Fragment key={i}>
          <div css={bookStyle}>
            <a href={calilBookURL + reference.isbn} target='_blank' rel="noreferrer" >
              {books[reference.isbn]?.url &&
                <Image src={books[reference.isbn].url} width='100' height='138' objectFit="contain" alt={reference.name} />
              }
              <Spacer height='10' />
              {!books[reference.isbn]?.url &&
                <Container width='100' height='138'>
                  <NoImage textSize='14' color='gray' backgroundColor='lightgray' />
                </Container>
              }
              <AlignContainer textAlign='center'>
                <PlainText size='14' color='darkgray'>
                  <div>{reference.name}</div>
                </PlainText>
                <Spacer height='5' />
                <PlainText size='13' color='darkgray'>
                  <div>{books[reference.isbn]?.author}</div>
                </PlainText>
              </AlignContainer>
            </a>
          </div>
        </Fragment>
      ))}
    </Flex>
  )
}

const bookStyle = css({
  width: '100px',
  marginLeft: '20px',
  marginRight: '20px',
})