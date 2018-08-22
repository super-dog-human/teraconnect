import React from 'react';

const LessonGraphic = ({graphic}) => (
    <div className="lesson-graphic">
        <div className="lesson-graphic-cell">
            <img src={graphic.url} id="lesson-graphic-body" />
        </div>
        <style jsx>{`
            .lesson-graphic {
                position: absolute;
                top: 0;
                width: 100%;
                height :100%;
                display: table;
            }
            .lesson-graphic-cell {
                position: relative;
                display: table-cell;
                text-align: ${graphic.horizontalAlign};
                vertical-align: ${graphic.verticalAlign};
            }
            #lesson-graphic-body {
                width: ${graphic.sizePct}%;
                max-height: ${graphic.sizePct}%;
                object-fit: contain;
                animation-duration: 0.1s;
                animation-name: ${'fade-in'};
            }
        `}</style>
    </div>
)

export default ({graphics}) => (
    <div id="lesson-graphics">{
        graphics.map((graphic, i) => {
            return <LessonGraphic graphic={graphic} key={i} className="lesson-graphic" />;
        })
    }
    <style jsx>{`
        #lesson-graphics {
            position: absolute;
            top: 0;
            width: 100%;
            height :100%;
            z-index: -100;
        }
    `}</style>
    </div>
)

// fill or keep size
