import React from 'react'
import { stringToMinutesFormat } from '../../utils/utility'
import styled from '@emotion/styled'

export default props => (
    <RangeSlider isShow={props.isShow}>
        <InputRange type="range" min="0" step="any" {...props} />
        <TimeIndicator>
            {stringToMinutesFormat(props.value)} /{' '}
            {stringToMinutesFormat(props.max)}
        </TimeIndicator>
    </RangeSlider>
)

const RangeSlider = styled.div`
    position: absolute;
    bottom: 2%;
    left: 3%;
    right: 3%;
    opacity: ${props => (props.isShow ? 0.7 : 0)};
`

const InputRange = styled.input`
    appearance: none;
    -webkit-appearance: none;
    width: 100%;
    height: 10px;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 250; // seek bar
    cursor: pointer;
    &:focus,
    &:active {
        outline: none;
    }
    :-moz-focusring {
        outline: none;
    }
    &::-webkit-slider-thumb {
        appearance: none;
        -webkit-appearance: none;
        position: relative;
        width: 15px;
        height: 15px;
        display: block;
        background-color: var(--dark-gray);
        border-radius: 50%;
        -webkit-border-radius: 50%;
    }
    &::-moz-range-thumb {
        appearance: none;
        -webkit-appearance: none;
        position: relative;
        width: 15px;
        height: 15px;
        display: block;
        background-color: var(--dark-gray);
        border-radius: 50%;
        -webkit-border-radius: 50%;
    }
`

const TimeIndicator = styled.div`
    margin-top: 10px;
    font-size: 15px;
    text-align: left;
`
