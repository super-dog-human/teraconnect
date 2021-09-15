import React from 'react'
import InputSearch from '../form/inputSearch'
import Container from '../container'
import ExpandContainer from '../transition/expandContainer'

export default function SearchForm({ isFocus, inputRef, onClose, onFocus, onBlur, onSubmit }) {
  return (
    <form noValidate action="" role="search" onSubmit={onSubmit}>
      <Container height='40'>
        <ExpandContainer isExpand={isFocus} initialWidth='0px' expandedWidth='300px' onRest={onClose}>
          <InputSearch name='teraconnect-search' size='15' padding='10' color='var(--dark-gray)' borderColor={isFocus ? 'var(--soft-white)' : 'white'} borderWidth='1px'
            onFocus={onFocus} onBlur={onBlur} ref={inputRef} />
        </ExpandContainer>
      </Container>
    </form>
  )
}