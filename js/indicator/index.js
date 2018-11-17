import React from 'react'
import { IndicatorContext } from '../context'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class Indicator extends React.Component {
    static contextType = IndicatorContext

    render() {
        return (
            <LoadingIndicator isLoading={this.context.isLoading}>
                <IndicatorBody>
                    <IndicatorIcon>
                        <FontAwesomeIcon icon="spinner" spin />
                    </IndicatorIcon>
                    <IndicatorMessage>
                        {this.context.indicatorMessage}
                    </IndicatorMessage>
                </IndicatorBody>
            </LoadingIndicator>
        )
    }
}

const LoadingIndicator = styled('div')(props => ({
    display: props.isLoading ? 'flex' : 'none',
    position: 'fixed',
    zIndex: 300, // indicator
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.4)'
}))

const IndicatorBody = styled('div')(() => ({
    display: 'block',
    textAlign: 'center'
}))

const IndicatorIcon = styled('div')(() => ({
    fontSize: '2vw'
}))

const IndicatorMessage = styled('div')(() => ({
    fontSize: '0.9vw',
    marginTop: '1vh'
}))
