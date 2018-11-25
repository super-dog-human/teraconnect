import React from 'react'
import { stringToMinutesFormat } from '../../utils/utility'
import styled from '@emotion/styled'

export default props => (
    <>
        <RangeSlider type="range" value="0" min="0" step="any" {...props} />
        <span>
            {stringToMinutesFormat(props.value)} /{' '}
            {stringToMinutesFormat(props.max)}
        </span>
    </>
)

const RangeSlider = styled.input`
    appearance: none;
    -webkit-appearance: none;
    position: absolute;
    bottom: 7%;
    left: 3%;
    right: 3%;
    width: 94%;
    height: 4px;
    background-color: rgba(0, 0, 0, 0.2);
    z-index: 250; // seek bar
    cursor: pointer;
    $:hover {
        opacity: 0.7;
    }
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
