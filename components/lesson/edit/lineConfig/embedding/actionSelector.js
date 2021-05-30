import React from 'react'
import PlainText from '../../../../plainText'
import Spacer from '../../../../spacer'
import Flex from '../../../../flex'
import InputRadio from '../../../../form/inputRadio'

const labels = [
  { action: 'show', body: '表示' },
  { action: 'hide', body: '非表示' },
]

export default function ActionSelector({ selectedAction, dispatchConfig, disabled }) {
  function handleChange(e) {
    dispatchConfig({ type: 'action', payload: e.currentTarget.dataset.action })
  }

  return (
    <>
      {labels.map((label, i) => (
        <React.Fragment key={i}>
          <Flex alignItems='center'>
            <InputRadio id={`embedding${label.action}`} name='embeddingLine' data-action={label.action} size='16' color='var(--soft-white)'
              checked={selectedAction === label.action} disabled={disabled} onChange={handleChange}>
              <PlainText size='13' lineHeight='18' color='var(--soft-white)'>{label.body}</PlainText>
            </InputRadio>
            <Spacer width='30' />
          </Flex>
        </React.Fragment>
      ))}
    </>
  )
}