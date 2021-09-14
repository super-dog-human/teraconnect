import React, { useRef, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { connectSearchBox } from 'react-instantsearch-dom'
import InputSearch from '../form/inputSearch'
import Flex from '../flex'
import IconButton from '../button/iconButton'
import Container from '../container'
import ExpandContainer from '../transition/expandContainer'
import Spacer from '../spacer'
import LoadingIndicator from '../loadingIndicator'

const AlgoliaSearchBox = ({ currentRefinement, isSearchStalled, refine }) => {
  const inputRef = useRef()
  const [isFocus, setIsFocus] = useState(false)
  const router = useRouter()

  function handleFocus() {
    setIsFocus(true)
  }

  function handleBlur() {
    setIsFocus(false)
  }

  function handleChange(e) {
    refine(e.currentTarget.value)
    router.push({
      pathname: '/search',
      query: { q: e.currentTarget.value },
    })
  }

  function handleSubmit(e) {
    e.preventDefault()
  }

  function handleSearchButtonClick() {
    inputRef.current.focus()
  }

  useEffect(() => {
    const keyword = router.query.q
    if (keyword) refine(keyword)
  }, [router, refine])

  return (
    <Flex alignItems='center'>
      <form noValidate action="" role="search" onSubmit={handleSubmit}>
        <Container height='40'>
          <ExpandContainer isExpand={isFocus} initialWidth='100px' expandedWidth='300px'>
            <InputSearch size='15' padding='10' color='var(--dark-gray)' borderColor={isFocus ? 'var(--soft-white)' : 'white'} borderWidth='1px'
              value={currentRefinement} onFocus={handleFocus} onBlur={handleBlur} onChange={handleChange} ref={inputRef} />
          </ExpandContainer>
        </Container>
      </form>
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
