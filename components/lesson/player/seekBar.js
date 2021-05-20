import React from 'react'
import Container from '../../container'
import ContainerSpacer from '../../containerSpacer'
import ColorFilter from '../../colorFilter'
import InputRange from '../../form/inputRange'

export default function SeekBar({ invisible, playerElapsedTime, maxTime, onDragStart, onSeekChange }) {
  return (
    <Container invisible={invisible}>
      <ContainerSpacer left='15' right='15'>
        <ColorFilter filter='drop-shadow(2px 2px 2px var(--dark-purple))'>
          <InputRange key={playerElapsedTime} defaultValue={playerElapsedTime} min='0' max={parseFloat((maxTime).toFixed(2))} step='0.01'
            onDragStart={onDragStart} onInput={onSeekChange} onChange={onSeekChange} />
        </ColorFilter>
      </ContainerSpacer>
    </Container>
  )
}