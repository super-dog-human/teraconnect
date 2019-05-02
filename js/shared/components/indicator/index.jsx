import React, { useState } from 'react'
import styled from '@emotion/styled'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IndicatorContext } from './context'

export default props => {
    const [isLoading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    return (
        <>
            <LoadingIndicator isLoading={isLoading}>
                <IndicatorBody>
                    <IndicatorIcon>
                        <FontAwesomeIcon icon="spinner" spin />
                    </IndicatorIcon>
                    <IndicatorMessage>{message}</IndicatorMessage>
                </IndicatorBody>
            </LoadingIndicator>

            <IndicatorContext.Provider
                value={{
                    setLoading: status => setLoading(status),
                    setMessage: message => setMessage(message)
                }}
            >
                {props.children}
            </IndicatorContext.Provider>
        </>
    )
}

const LoadingIndicator = styled.div`
    display: ${props => (props.isLoading ? 'flex' : 'none')};
    position: fixed;
    z-index: 300; // indicator
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    justify-content: center;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.4);
`

const IndicatorBody = styled.div`
    display: block;
    text-align: center;
`

const IndicatorIcon = styled.div`
    font-size: 2vw;
`

const IndicatorMessage = styled.div`
    font-size: 0.9vw;
    margin-top: 1vh;
    color: gray;
`
