/** @jsxImportSource @emotion/react */
import React, { useRef, useState, useEffect } from 'react'
import { css } from '@emotion/core'
import { useRouter } from 'next/router'
import { connectSearchBox } from 'react-instantsearch-dom'
import Flex from '../../flex'
import IconButton from '../../button/iconButton'
import AbsoluteContainer from '../../absoluteContainer'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import Spacer from '../../spacer'
import LoadingIndicator from '../../loadingIndicator'
import InputSearch from '../../form/inputSearch'

const SearchBar = ({ handleMenuTouchEnd, isSearchStalled, refine }) => {
  const inputRef = useRef()
  const router = useRouter()
  const [isFocus, setIsFocus] = useState(true)

  function handleFocus() {
    setIsFocus(true)
  }

  function handleBlur() {
    setIsFocus(false)
  }

  function handleKeyDown(e) {
    if (e.keyCode !== 13) return // 'keyCode' はdeprecatedだがこれ以外の方法では日本語の確定を判断できなさそう
    search(inputRef.current.value)
  }

  function handleSearchButtonTouchEnd() {
    if (inputRef.current.value) {
      search(inputRef.current.value)
    } else {
      inputRef.current.focus()
    }
  }

  function search(keyword) {
    refine(keyword)
    router.push({
      pathname: '/search',
      query: { q: keyword },
    })
  }

  useEffect(() => {
    const keyword = router.query.q
    if (keyword) {
      inputRef.current.value = keyword
      refine(keyword)
    }
    inputRef.current.focus()
  }, [router, refine])

  const inputStyle = css({
    width: isFocus ? '100%' : 'calc(100% - 66px)',
  })

  return (
    <>
      <ContainerSpacer left='10' right='10'>
        <Flex justifyContent='flex-start' alignItems='center'>
          <Spacer height='60' />
          <InputSearch name='teraconnect-search' size='16' padding='10' color='var(--dark-gray)' borderColor='var(--soft-white)' borderWidth='1px'
            onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleKeyDown} css={inputStyle} ref={inputRef} />
          {!isFocus &&
            <>
              <AbsoluteContainer top='0' right='0'>
                <Flex alignItems='center'>
                  <Spacer height='60' />
                  <Container width='25' height='25'>
                    {isSearchStalled &&
                      <Container width='20' height='20'>
                        <LoadingIndicator size='100'/>
                      </Container>
                    }
                    {!isSearchStalled &&
                      <IconButton name='search' onTouchEnd={handleSearchButtonTouchEnd} />
                    }
                  </Container>
                  <Container width='40'>
                    <IconButton name='menu' padding='11' onTouchEnd={handleMenuTouchEnd} />
                  </Container>
                </Flex>
              </AbsoluteContainer>
            </>
          }
        </Flex>
      </ContainerSpacer>
    </>
  )
}

export default connectSearchBox(SearchBar)