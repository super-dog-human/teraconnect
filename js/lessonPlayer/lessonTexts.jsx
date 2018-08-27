import React from 'react';

const LessonText = ({text}) => (
    <div id="lesson-text">
        <div id="lesson-text-body">{text.body}</div>
        <style jsx>{`
            #lesson-text {
                position: absolute;
                top: 0;
                width: 100%;
                height :100%;
                display: table;
            }
            #lesson-text-body {
                position: relative;
                display: table-cell;
                text-align: ${text.horizontalAlign};
                vertical-align: ${text.verticalAlign};
                padding: 1vw;
                white-space: pre-wrap;
                font-weight: bold;
                font-size: ${text.sizeVW}vw;
                color: ${text.bodyColor};
                text-shadow:
                    ${text.borderColor} 0.5vw 0px,  ${text.borderColor} -0.5vw 0px,
                    ${text.borderColor} 0px -0.5vw, ${text.borderColor} 0px 0.5vw,
                    ${text.borderColor} 0.5vw 0.5vw , ${text.borderColor} -0.5vw 0.5vw,
                    ${text.borderColor} 0.5vw -0.5vw, ${text.borderColor} -0.5vw -0.5vw,
                    ${text.borderColor} 0.25vw 0.5vw,  ${text.borderColor} -0.25vw 0.5vw,
                    ${text.borderColor} 0.25vw -0.5vw, ${text.borderColor} -0.25vw -0.5vw,
                    ${text.borderColor} 0.5vw 0.25vw,  ${text.borderColor} -0.5vw 0.25vw,
                    ${text.borderColor} 0.5vw -0.25vw, ${text.borderColor} -0.5vw -0.25vw;
            }
        `}</style>
    </div>
)

export default ({texts}) => (
    <div id="lesson-texts">{
        texts.map((text, i) => {
            return <LessonText text={text} key={i} className="lesson-text"/>;
        })
        }
        <style jsx>{`
            #lesson-texts {
                position: absolute;
                top: 0;
                width: 100%;
                height :100%;
                z-index: 10;
            }
        `}</style>
    </div>
)