import React from 'react'
import ContainerSpacer from '../containerSpacer'
import PlainText from '../plainText'

const Head = ({ children }) => (
  <PlainText color='gray'>
    <ContainerSpacer top='20' bottom='20'>
      <div>
        <PlainText size='23'>
          {children}
        </PlainText>
      </div>
    </ContainerSpacer>
  </PlainText>
)

export default Head