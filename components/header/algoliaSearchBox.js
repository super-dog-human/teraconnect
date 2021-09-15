import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { connectSearchBox } from 'react-instantsearch-dom'
import Flex from '../flex'
import IconButton from '../button/iconButton'
import Container from '../container'
import Spacer from '../spacer'
import LoadingIndicator from '../loadingIndicator'
import SearchForm from './searchForm'

const AlgoliaSearchBox = ({ isSearchStalled, refine }) => {
  const inputRef = useRef()
  const [isFocus, setIsFocus] = useState(false)
  const router = useRouter()

  function handleFocus() {
    setIsFocus(true)
  }

  function handleBlur() {
    if (!inputRef.current.value) setIsFocus(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    search(inputRef.current.value)
  }

  function handleSearchButtonClick() {
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
      setIsFocus(true)
      inputRef.current.value = keyword
      refine(keyword)
    }
  }, [router, refine])

  return (
    <Flex alignItems='center'>
      <SearchForm isFocus={isFocus} inputRef={inputRef} onFocus={handleFocus} onBlur={handleBlur} onSubmit={handleSubmit} />
      <Spacer width='10' />
      <Container width='25' height='25'>
        {isSearchStalled &&
          <Container width='20' height='20'>
            <LoadingIndicator />
          </Container>
        }
        {!isSearchStalled &&
          <IconButton name='search' onClick={handleSearchButtonClick} />
        }
      </Container>
    </Flex>
  )
}

export default connectSearchBox(AlgoliaSearchBox)
