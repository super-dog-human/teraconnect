import React from 'react';

const LessonText = ({text, textPadingSize, textShadowHarfSize, textShadowQuarterSize}) => (
    <div id="lesson-text">
        <div id="lesson-text-body">{text.body}</div>
        <style jsx>{`
            #lesson-text {
                display: table;
                width: 100%;
                height :100%;
            }
            #lesson-text-body {
                display: table-cell;
                text-align: ${text.horizontalAlign};
                vertical-align: ${text.verticalAlign};
                padding: ${textPadingSize}vw;
                white-space: pre-wrap;
                font-weight: bold;
                font-size: ${text.sizeVW}vw;
                color: ${text.bodyColor};
                text-shadow:
                    ${text.borderColor} ${textShadowHarfSize}vw     0,                          ${text.borderColor} -${textShadowHarfSize}vw     0,
                    ${text.borderColor} 0                          -${textShadowHarfSize}vw,    ${text.borderColor}  0                           ${textShadowHarfSize}vw,
                    ${text.borderColor} ${textShadowHarfSize}vw     ${textShadowHarfSize}vw,    ${text.borderColor} -${textShadowHarfSize}vw     ${textShadowHarfSize}vw,
                    ${text.borderColor} ${textShadowHarfSize}vw    -${textShadowHarfSize}vw,    ${text.borderColor} -${textShadowHarfSize}vw    -${textShadowHarfSize}vw,
                    ${text.borderColor} ${textShadowQuarterSize}vw  ${textShadowHarfSize}vw,    ${text.borderColor} -${textShadowQuarterSize}vw  ${textShadowHarfSize}vw,
                    ${text.borderColor} ${textShadowQuarterSize}vw -${textShadowHarfSize}vw,    ${text.borderColor} -${textShadowQuarterSize}vw -${textShadowHarfSize}vw,
                    ${text.borderColor} ${textShadowHarfSize}vw     ${textShadowQuarterSize}vw, ${text.borderColor} -${textShadowHarfSize}vw     ${textShadowQuarterSize}vw,
                    ${text.borderColor} ${textShadowHarfSize}vw    -${textShadowQuarterSize}vw, ${text.borderColor} -${textShadowHarfSize}vw    -${textShadowQuarterSize}vw;
                }
        `}</style>
    </div>
)

export default class LessonTexts extends React.Component {
    constructor(props) {
        super(props)
        this.textsElement;
        this.textShadowHarfSize = 0;
        this.textShadowQuarterSize = 0;
    }

    componentWillReceiveProps() {
        this.textSizeMultiplier = this.textsElement.clientWidth / document.documentElement.clientWidth;
        this.textShadowHarfSize    = 0.5 * this.textSizeMultiplier;
        this.textShadowQuarterSize = 0.25 * this.textSizeMultiplier;
    }

    render() {
        return(
            <div id="lesson-texts" ref={(e) => { this.textsElement = e; }}>{
                this.props.texts.map((t, i) => {
                    const text = Object.assign({}, t);
                    text.horizontalAlign = text.horizontalAlign || 'center';
                    text.verticalAlign   = text.verticalAlign || 'bottom';
                    text.sizeVW          = (text.sizeVW || 5) * this.textSizeMultiplier;
                    text.bodyColor       = text.bodyColor || 'white';
                    text.borderColor     = text.borderColor || '#ff6699';

                    return <LessonText text={text}
                        textPadingSize={this.textSizeMultiplier} // just use multiplier because default padidng is 1.
                        textShadowHarfSize={this.textShadowHarfSize}
                        textShadowQuarterSize={this.textShadowQuarterSize}
                        key={i} />;
                })
            }
                <style jsx>{`
                    #lesson-texts {
                        position: absolute;
                        z-index: 100;
                        top: 0;
                        width: 100%;
                        height :100%;
                    }
                `}</style>
            </div>
        )
    }
}