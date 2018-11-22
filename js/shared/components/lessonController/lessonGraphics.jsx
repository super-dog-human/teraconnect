import React from 'react'
import styled from '@emotion/styled'

const LessonGraphicContainer = styled.div`
    position: absolute;
    display: table;
    width: 100%;
    height: 100%;
    z-index: 0; // graphic
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
`

const LessonGraphicCell = styled.div`
    width: 100%;
    height: 100%;
    display: table-cell;
    text-align: ${props =>
        props.horizontalAlign != '' ? props.horizontalAlign : 'center'};
    vertical-align: ${props =>
        props.verticalAlign != '' ? props.verticalAlign : 'middle'};
`

const LessonGraphic = styled.img`
    max-width: ${props => `${props.sizePct > 0 ? props.sizePct : 100}%`};
    max-heidht: ${props => `${props.sizePct > 0 ? props.sizePct : 100}%`};
    object-fit: contain;
    animation-duration: 0.3s;
    animation-name: fadeIn;
`

export default ({ graphics }) => (
    <LessonGraphicContainer>
        {graphics.map((graphic, i) => {
            return (
                <LessonGraphicCell
                    key={i}
                    horizontalAlign={graphic.horizontalAlign}
                    verticalAlign={graphic.verticalAlign}
                >
                    <LessonGraphic
                        src={graphic.url}
                        sizePct={graphic.sizePct}
                    />
                </LessonGraphicCell>
            )
        })}
    </LessonGraphicContainer>
)
