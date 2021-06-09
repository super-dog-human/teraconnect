import React from 'react'
import Spacer from '../../../../spacer'
import Container from '../../../../container'
import ContainerSpacer from '../../../../containerSpacer'
import Flex from '../../../../flex'
import PlainText from '../../../../plainText'
import Select from '../../../../form/select'
import InputText from '../../../../form/inputText'
import DialogHeader from '../configDialog/dialogHeader'
import DialogFooter from '../configDialog/dialogFooter'
import ActionSelector from './actionSelector'
import useEmbeddingConfig from '../../../../../libs/hooks/lesson/edit/useEmbeddingConfig'

export default function Embedding(props) {
  const { config, dispatchConfig, serviceOptions, isInvalidInput, handleServiceChange, handleContentIDBlur, handleConfirm, handleCancel } = useEmbeddingConfig(props)

  return (
    <>
      <DialogHeader onCloseClick={handleCancel} />

      <ContainerSpacer left='50' right='50'>
        <Flex justifyContent='space-between'>
          <Flex>
            <ActionSelector selectedAction={config.action} dispatchConfig={dispatchConfig} />
          </Flex>
          <Spacer height='30' />
          {config.action === 'show' &&
            <Container width='150' height='30'>
              <Select color='var(--soft-white)' value={config.serviceName} options={serviceOptions} topLabel={null} onChange={handleServiceChange} />
            </Container>
          }
        </Flex>

        <ContainerSpacer top='50' bottom='60'>
          <Container height='60'>
            {config.action === 'show' && config.serviceName === 'youtube' &&
              <>
                <Flex alignItems='center'>
                  <PlainText size='14' color='var(--soft-white)'>https://www.youtube.com/embed/</PlainText>
                  <Spacer width='10' />
                  <Container width='130' height='30'>
                    <InputText size='16' textAlign='center' color='var(--soft-white)' borderColor='var(--soft-white)' borderWidth='0 0 1px 0'
                      placeholder='ビデオIDを入力' defaultValue={config.contentID} maxLength='11' onBlur={handleContentIDBlur} />
                  </Container>
                  <Spacer width='10' />
                  <PlainText size='14' color='var(--soft-white)'>?autoplay=1&mute=1</PlainText>
                </Flex>
                <Spacer height='10' />
                <PlainText size='12' color='var(--text-gray)'>仕様上の制限のため、ミュート状態で再生されます。</PlainText>
                <Spacer height='10' />
                {isInvalidInput && <PlainText size='13' color='var(--error-red)'>ビデオIDは11文字で入力してください。</PlainText>}
              </>
            }
            {config.action === 'show' && config.serviceName === 'geogebra' &&
              <>
                <Flex alignItems='center'>
                  <PlainText size='14' color='var(--soft-white)'>https://www.geogebra.org/material/iframe/id/</PlainText>
                  <Spacer width='4' />
                  <Container width='130' height='30'>
                    <InputText size='16' textAlign='center' color='var(--soft-white)' borderColor='var(--soft-white)' borderWidth='0 0 1px 0'
                      placeholder='教材IDを入力' defaultValue={config.contentID} maxLength='8' onChange={handleContentIDBlur} />
                  </Container>
                </Flex>
                {isInvalidInput && <PlainText size='13' color='var(--error-red)'>教材IDは8文字で入力してください。</PlainText>}
              </>
            }
          </Container>
        </ContainerSpacer>

        <Container height='60'>
          <DialogFooter elapsedTime={config.elapsedTime} dispatchConfig={dispatchConfig} onConfirm={handleConfirm} onCancel={handleCancel} />
        </Container>
      </ContainerSpacer>
    </>
  )
}