/** @jsxImportSource @emotion/react */
import React from 'react'
import { css } from '@emotion/core'
import PlainText from '../../plainText'

const StatusLabel = ({ status }) => {
  const statusLabelStyle = css({
    width: '70px',
    height: '28px',
    textAlign: 'center',
    borderRadius: '5px',
    backgroundColor: status === 'draft' ? 'gray' : status === 'limited' ? 'var(--error-red)' : '#479F55',
  })

  return (
    <div css={statusLabelStyle}>
      <PlainText color='white' size='13' fontWeight='bold'>
        {status === 'draft' ? '下書き' : status === 'limited' ? '限定公開' : '公開中' }
      </PlainText>
    </div>
  )
}

export default StatusLabel