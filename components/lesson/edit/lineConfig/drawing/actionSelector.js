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
    setSelectedAction(e.currentTarget.value)
  }

  return (
    <Flex>
      {labels.filter(l => initialAction === 'draw' ? l : l.action !== 'draw').map((label, i) => (
        <React.Fragment key={i}>
          <InputRadio id={`drawing${label.action}`} name='drawingLine' size='16' color='var(--soft-white)'
            value={label.action} checked={selectedAction === label.action} disabled={disabled} onChange={handleChange}>
            <Flex alignItems='center'>
              <PlainText size='14' color='var(--soft-white)'>{label.body}</PlainText>
            </Flex>
          </InputRadio>
          <Spacer width='30' />
        </React.Fragment>
      ))}
    </Flex>
  )
}