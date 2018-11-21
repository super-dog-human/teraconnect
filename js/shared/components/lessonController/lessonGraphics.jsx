import React from 'react'
import styled from '@emotion/styled'

const LessonGraphics = styled.div`
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 0; // graphic
`

const LessonGraphicContainer = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
`

const LessonGraphicSrc = styled.img`
    width: ${props => `${props.sizePct > 0 ? props.sizePct : 100}%`};
    height: ${props => `${props.sizePct > 0 ? props.sizePct : 100}%`};
    object-fit: contain;
    animation-duration: 0.3s;
    animation-name: ${'fade-in'};
`

const LessonGraphic = ({ graphic }) => (
    <LessonGraphicContainer>
        <LessonGraphicSrc
            src={graphic.url}
            width={graphic.sizePct}
            height={graphic.sizePct}
        />
    </LessonGraphicContainer>
)

export default ({ graphics }) => (
    <LessonGraphics>
        {graphics.map((graphic, i) => {
            return <LessonGraphic graphic={graphic} key={i} />
        })}
    </LessonGraphics>
)
