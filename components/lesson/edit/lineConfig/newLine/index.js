import React, { useState } from 'react'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import Spacer from '../../../../spacer'
import Flex from '../../../../flex'
import FlexItem from '../../../../flexItem'
import PlainText from '../../../../plainText'
import LabelButton from '../../../../button/labelButton'
import Icon from '../../../../icon'
import IconButton from '../../../../button/iconButton'
import DragHandler from '../../../../dragHandler'
import { useLessonEditorContext } from '../../../../../libs/contexts/lessonEditorContext'

const buttons = [
  { kind: 'speech',   label: '音声',      description: 'マイクで音声を録音したり、合成音声を作成します。' },
  { kind: 'graphic',  label: '画像',      description: 'アップロードした画像を表示・非表示します。' },
  { kind: 'drawing',  label: '板書',      description: '自由な線を描いたり消したりします。' },
  { kind: 'avatar',   label: 'アバター',   description: 'アバターの位置や大きさを変更します。' },
  { kind: 'embedding', label: '外部リンク', description: 'YouTubeやGeoGebraを埋め込みます。' },
  { kind: 'music',    label: 'BGM',      description: '音楽を再生・停止します。' },
]

export default function NewLine({ elapsedTime, closeCallback }) {
  const [description, setDescription] = useState('')
  const { addAvatarLine, addDrawingLine, addEmbedding, addGraphicLine, addMusicLine, addSpeechLine } = useLessonEditorContext()

  function handleMouseEnter(e) {
    setDescription(buttons[e.currentTarget.dataset.index].description)
  }

  function handleMouseLeave() {
    setDescription('')
  }

  function handleClick(e) {
    const kind = buttons[e.currentTarget.dataset.index].kind
    switch(kind) {
    case 'avatar':
      addAvatarLine(elapsedTime)
      break
    case 'drawing':
      addDrawingLine(elapsedTime)
      break
    case 'embedding':
      addEmbedding(elapsedTime)
      break
    case 'graphic':
      addGraphicLine(elapsedTime)
      break
    case 'music':
      addMusicLine(elapsedTime)
      break
    case 'speech':
      addSpeechLine(elapsedTime)
      break
    }

    closeCallback()
  }

  return (
    <>
      <DragHandler>
        <AlignContainer textAlign='right'>
          <Container width='36' height='36' display='inline-block'>
            <IconButton name={'close'} padding='10' onClick={closeCallback} />
          </Container>
        </AlignContainer>
      </DragHandler>
      <ContainerSpacer top='0' left='130' right='130'>
        <Flex flexWrap='wrap'>
          {buttons.map((b, i) => (
            <>
              <FlexItem column='3' flexGrow='2'>
                <LabelButton hoverBorderColor='var(--text-gray)' data-index={i} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                  <Flex>
                    <Container width='20'>
                      <Icon name={'timeline-' + b.kind} />
                    </Container>
                    <Spacer width='20' />
                    <PlainText color='var(--soft-white)' lineHeight='45'>{b.label}</PlainText>
                  </Flex>
                </LabelButton>
              </FlexItem>
              {i % 2 === 0 &&
                <FlexItem column='3' flexBasis='0'>
                  <Container width='70' />
                </FlexItem>
              }
              {i % 2 === 1 &&
                <FlexItem column='1'>
                  <Spacer height='10' />
                </FlexItem>
              }
            </>
          ))}
        </Flex>
      </ContainerSpacer>
      <ContainerSpacer top='20' bottom='30' left='60' right='60'>
        <Container height='30'>
          <AlignContainer textAlign='center'>
            <PlainText size='13' color='var(--soft-white)'>{description}</PlainText>
          </AlignContainer>
        </Container>
      </ContainerSpacer>
    </>
  )
}