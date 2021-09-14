import React, { useRef, useState } from 'react'
import { useRouter } from 'next/router'
import InputSearch from '../form/inputSearch'
import Flex from '../flex'
import IconButton from '../button/iconButton'
import Container from '../container'
import ExpandContainer from '../transition/expandContainer'
import Spacer from '../spacer'

export default function SearchBox() {
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
      <form noValidate action="" role="search" onSubmit={handleSubmit}>
        <Container height='40'>
          <ExpandContainer isExpand={isFocus} initialWidth='100px' expandedWidth='300px'>
            <InputSearch size='15' padding='10' color='var(--dark-gray)' borderColor={isFocus ? 'var(--soft-white)' : 'white'} borderWidth='1px'
              onFocus={handleFocus} onBlur={handleBlur} ref={inputRef} />
          </ExpandContainer>
        </Container>
      </form>
      <Spacer width='10' />
      <Container width='25' height='25'>
        <IconButton name='search' onClick={handleSearchButtonClick} />
      </Container>
    </Flex>
  )
}