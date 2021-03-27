/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import LabelButton from '../../../../button/labelButton'

export default function DialogButton({ label, kind, onClick }) {
  const color = kind === 'confirm' ? 'var(--dark-gray)' : 'white'
  const backgroundColor = kind === 'confirm' ? 'white' : 'var(--dark-gray)'
  const borderColor = kind === 'confirm' ? 'inherit' : 'var(--text-gray)'

  const bodyStyle = css({
    width: '100px',
    height: '40px',
  })

  return (
    <div css={bodyStyle}>
      <LabelButton size='15' backgroundColor={backgroundColor} color={color} borderColor={borderColor} onClick={onClick}>
        {label}
      </LabelButton>
    </div>
  )
}