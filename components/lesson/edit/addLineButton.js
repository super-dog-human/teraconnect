import React from 'react'
import Flex from '../../flex'
import IconButton from '../../button/iconButton'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'

const AddLineButton = ({ isNarrowScreen, setLineConfig }) => {
  const handleButtonClick = () => {
    setLineConfig({
      action: 'newLine', elapsedTime: 0,
    })
  }

  return (
    <ContainerSpacer top={isNarrowScreen && '15'} right={isNarrowScreen && '15'}>
      <Flex justifyContent='flex-end'>
        <Container width='20' height='20'>
          <IconButton name='add' onClick={handleButtonClick} />
        </Container>
      </Flex>
    </ContainerSpacer>
  )
}

export default AddLineButton