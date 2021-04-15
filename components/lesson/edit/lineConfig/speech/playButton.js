import React from 'react'
import IconButton from '../../../../button/iconButton'

export default function PlayButton({ isPlaying, onClick, disabled }) {
  return (
    <>
      {!isPlaying && <IconButton name='play' backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='10' onClick={onClick} disabled={disabled} />}
      {isPlaying  && <IconButton name='pause' backgroundColor='var(--dark-gray)' borderColor='var(--border-dark-gray)' padding='10' onClick={onClick} disabled={disabled} />}
    </>
  )
}