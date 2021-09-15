import React, { useRef } from 'react'
import { useRouter } from 'next/router'
import Flex from '../flex'
import IconButton from '../button/iconButton'
import Container from '../container'
import Spacer from '../spacer'
import SearchForm from './searchForm'

export default function SearchBox({ isFocus, setIsFocus, onClose }) {
  const inputRef = useRef()
  const router = useRouter()

  function handleFocus() {
    setIsFocus(true)
  }

  function handleBlur() {
    if (!inputRef.current.value) setIsFocus(false)
  }

  function handleSubmit(e) {
    e.preventDefault()
    transitPage()
  }

  function handleSearchButtonClick() {
    if (inputRef.current.value) {
      transitPage()
    } else {
      inputRef.current.focus()
    }
  }

  function transitPage() {
    router.push({
      pathname: '/search',
      query: { q: inputRef.current.value },
    })
  }

  return (
    <Flex alignItems='center'>
      <SearchForm isFocus={isFocus} inputRef={inputRef} onClose={onClose} onFocus={handleFocus} onBlur={handleBlur} onSubmit={handleSubmit} />
      <Spacer width='10' height='60' />
      <Container width='25' height='25'>
        <IconButton name='search' onClick={handleSearchButtonClick} />
      </Container>
    </Flex>
  )
}