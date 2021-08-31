import React from 'react'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import ColorFilter from '../../colorFilter'
import InputRange from '../../form/inputRange'
import Flex from '../../flex'

export default function SeekBar({ isPlaying, invisible, playerElapsedTime, maxTime, onSeekChange, onSeekUp }) {
  return (
    <Container invisible={invisible}>
      <ContainerSpacer left='15' right='15'>
        <ColorFilter filter='drop-shadow(2px 2px 2px var(--dark-purple))'>
          <Flex>
            <InputRange key={isPlaying ? playerElapsedTime : null} color='var(--soft-white)' defaultValue={playerElapsedTime}
              min='0' max={parseFloat((maxTime).toFixed(2))} step='0.01' onChange={onSeekChange} onMouseUp={onSeekUp}/>
          </Flex>
        </ColorFilter>
      </ContainerSpacer>
    </Container>
  )
}