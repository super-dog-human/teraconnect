import React from 'react'
import ContainerSpacer from '../../../containerSpacer'
import Container from '../../../container'
import PlainText from '../../../plainText'

export default function ErrorNotice({ kind }) {
  return (
    <ContainerSpacer left='10'>
      <Container height='35'>
        <PlainText size='11' lineHeight='11' color='var(--error-red)'>
          { kind === 'drawing' && '前の板書の終了よりも先にこの板書が開始されています。開始時間を変更してください。' }
          { kind === 'speech' && '前の音声の終了よりも先にこの音声が開始されています。開始時間を変更してください。' }
        </PlainText>
      </Container>
    </ContainerSpacer>
  )
}