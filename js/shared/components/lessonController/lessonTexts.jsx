import React from 'react'
import styled from '@emotion/styled'

export default class LessonTexts extends React.Component {
    constructor(props) {
        super(props)
        this.textsElement
        this.textShadowHarfSize = 0
        this.textShadowQuarterSize = 0
    }

    componentWillReceiveProps() {
        this.textSizeMultiplier =
            this.textsElement.clientWidth / document.documentElement.clientWidth
        this.textShadowHarfSize = 0.5 * this.textSizeMultiplier
        this.textShadowQuarterSize = 0.25 * this.textSizeMultiplier
    }

    render() {
        return (
            <TextLines
                ref={e => {
                    this.textsElement = e
                }}
            >
                {this.props.texts.map((t, i) => {
                    const text = Object.assign({}, t)
                    text.horizontalAlign = text.horizontalAlign || 'center'
                    text.verticalAlign = text.verticalAlign || 'bottom'
                    text.sizeVW = (text.sizeVW || 5) * this.textSizeMultiplier
                    text.bodyColor = text.bodyColor || 'white'
                    text.borderColor = text.borderColor || '#ff6699'

                    return (
                        <TextLine key={i}>
                            <TextBody
                                text={text}
                                textPadingSize={this.textSizeMultiplier} // just use multiplier because default padidng is 1.
                                textShadowHarfSize={this.textShadowHarfSize}
                                textShadowQuarterSize={this.textShadowQuarterSize}
                        >
                                {text.body}
                            </TextBody>
                        </TextLine>
                    )
                })}
            </TextLines>
        )
    }
}

const TextLines = styled.div`
    position: absolute;
    z-index: 100; // text
    top: 0;
    width: 100%;
    height: 100%;
`

const TextLine = styled.div`
    position: absolute;
    display: table;
    width: 100%;
    height: 100%;
`

const TextBody = styled.div`
    display: table-cell;
    text-align: ${props => props.text.horizontalAlign};
    vertical-align: ${props => props.text.verticalAlign};
    padding: ${props=> props.textPadingSize}vw;
    white-space: pre-wrap;
    font-weight: bold;
    font-size: ${props => props.text.sizeVW}vw;
    color: ${props => props.text.bodyColor};
    text-shadow: ${props => `
        ${props.text.borderColor} ${props.textShadowHarfSize}vw      0,
        ${props.text.borderColor} -${props.textShadowHarfSize}vw     0,
        ${props.text.borderColor}  0                                -${props.textShadowHarfSize}vw,
        ${props.text.borderColor}  0                                 ${props.textShadowHarfSize}vw,
        ${props.text.borderColor}  ${props.textShadowHarfSize}vw     ${props.textShadowHarfSize}vw,
        ${props.text.borderColor} -${props.textShadowHarfSize}vw     ${props.textShadowHarfSize}vw,
        ${props.text.borderColor}  ${props.textShadowHarfSize}vw    -${props.textShadowHarfSize}vw,
        ${props.text.borderColor} -${props.textShadowHarfSize}vw    -${props.textShadowHarfSize}vw,
        ${props.text.borderColor}  ${props.textShadowQuarterSize}vw  ${props.textShadowHarfSize}vw,
        ${props.text.borderColor} -${props.textShadowQuarterSize}vw  ${props.textShadowHarfSize}vw,
        ${props.text.borderColor}  ${props.textShadowQuarterSize}vw -${props.textShadowHarfSize}vw,
        ${props.text.borderColor} -${props.textShadowQuarterSize}vw -${props.textShadowHarfSize}vw,
        ${props.text.borderColor}  ${props.textShadowHarfSize}vw     ${props.textShadowQuarterSize}vw,
        ${props.text.borderColor} -${props.textShadowHarfSize}vw     ${props.textShadowQuarterSize}vw,
        ${props.text.borderColor}  ${props.textShadowHarfSize}vw    -${props.textShadowQuarterSize}vw,
        ${props.text.borderColor} -${props.textShadowHarfSize}vw    -${props.textShadowQuarterSize}vw
    `};
`
