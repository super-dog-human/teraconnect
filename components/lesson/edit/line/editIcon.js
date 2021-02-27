/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'

export default function EditIcon({ onClick, isShow, className }) {
  const bodyStyle = css({
    display: 'flex',
    visibility: isShow ? 'visible' : 'hidden',
    justifyContent: 'center',
    width: '25px',
    marginLeft: '15px',
  })

  return(
    <div css={bodyStyle} className={className}>
      <Image src={'/img/icon/more.svg'} width={20} height={20} onClick={onClick} draggable={false} />
    </div>
  )
}