import React from 'react'
import PlainText from '../../../../plainText'
import Spacer from '../../../../spacer'
import Flex from '../../../../flex'
import InputRadio from '../../../../form/inputRadio'

const labels = [
  { action: 'draw',  body: '線を描く' },
  { action: 'clear', body: 'クリア' },
  { action: 'hide',  body: '非表示' },
  { action: 'show',  body: '再表示' },
]

export default function ActionSelector({ initialAction, selectedAction, setSelectedAction, disabled }) {
  function handleChange(e) {
    setSelectedAction(e.currentTarget.dataset.action)
  }

  return (
    <Flex>
      {labels.filter(l => initialAction === 'draw' ? l : l.action !== 'draw').map((label, i) => (
        <div key={i}>
          <Flex alignItems='center'>
            <InputRadio id={`drawing${label.action}`} name='drawingLine' data-action={label.action} size='16' color='var(--soft-white)'
              checked={selectedAction === label.action} disabled={disabled} onChange={handleChange}>
              <PlainText size='13' lineHeight='18' color='var(--soft-white)'>{label.body}</PlainText>
            </InputRadio>
            <Spacer width='30' />
          </Flex>
        </div>
      ))}
    </Flex>
  )
}