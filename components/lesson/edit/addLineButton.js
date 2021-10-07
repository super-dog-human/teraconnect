import React from 'react'
import Flex from '../../flex'
import IconButton from '../../button/iconButton'
import Container from '../../container'

const AddLineButton = ({ setLineConfig }) => {
  const handleButtonClick = () => {
    setLineConfig({
      action: 'newLine', elapsedTime: 0,
    })
  }

  return (
    <Flex justifyContent='flex-end'>
      <Container width='20' height='20'>
        <IconButton name='add' onClick={handleButtonClick} />
      </Container>
    </Flex>
  )
}

export default AddLineButton