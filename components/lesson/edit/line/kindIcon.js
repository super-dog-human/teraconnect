/** @jsxImportSource @emotion/react */
import React from 'react'
import Image from 'next/image'
import { css } from '@emotion/core'

export default function LessonEditKindIcon({ kind, status=true, className, onClick }) {
  const imageStyle = css({
    filter: status ? 'grayscale(0)' : 'grayscale(1) brightness(130%)',
  })

  return (
    <div css={bodyStyle} className={className}>
      {kind && <Image src={`/img/icon/timeline-${kind}.svg`} width={20} height={20} css={imageStyle} onClick={onClick} draggable={false} />}
    </div>
  )
}

const bodyStyle = css({
  display: 'flex',
  justifyContent: 'center',
  width: '25px',
  marginLeft: '15px',
  marginRight: '20px',
})