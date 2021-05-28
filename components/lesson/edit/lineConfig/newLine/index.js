import React from 'react'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import AlignContainer from '../../../../alignContainer'
import Spacer from '../../../../spacer'
import Flex from '../../../../flex'
import FlexItem from '../../../../flexItem'
import PlainText from '../../../../plainText'
import LabelButton from '../../../../button/labelButton'
import Icon from '../../../../icon'
import DialogHeader from '../configDialog/dialogHeader'
import useAddingNewLing from '../../../../../libs/hooks/lesson/edit/timeline/useAddingNewLine'

export default function NewLine({ elapsedTime, setLineConfig }) {
  const { addLineButtons, buttonDescription, handleMouseEnter, handleMouseLeave, handleButtonClick, handleCancel } = useAddingNewLing({ elapsedTime, setLineConfig })

  return (
    <>
      <DialogHeader onCloseClick={handleCancel} />
      <ContainerSpacer top='0' left='130' right='130'>
        <Flex flexWrap='wrap'>
          {addLineButtons.map((b, i) => (
            <React.Fragment key={i}>
              <FlexItem column='3' flexGrow='2'>
                <LabelButton hoverBorderColor='var(--text-gray)' data-index={i} onClick={handleButtonClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
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
            </React.Fragment>
          ))}
        </Flex>
      </ContainerSpacer>
      <ContainerSpacer top='20' bottom='30' left='60' right='60'>
        <Container height='30'>
          <AlignContainer textAlign='center'>
            <PlainText size='13' color='var(--soft-white)'>{buttonDescription}</PlainText>
          </AlignContainer>
        </Container>
      </ContainerSpacer>
    </>
  )
}