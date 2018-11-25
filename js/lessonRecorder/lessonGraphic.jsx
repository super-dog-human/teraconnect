import React from 'react'
import styled from '@emotion/styled'

export default ({ url }) => (
    <LessonGraphicContainer>
        <LessonGraphic src={url} />
    </LessonGraphicContainer>
)

const LessonGraphicContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    margin: auto;
    z-index: 0; // graphics
`

const LessonGraphic = styled.img`
    display: ${props => (props.src) != '' ? 'block' : 'none'};
    width: 100%;
    height: 100%;
    object-fit: contain;
    animation-duration: 0.3s;
    animation-name: ${'fade-in'};
`