import React from 'react'

const LessonGraphic = ({ graphic }) => (
    <div className="lesson-graphic">
        <img src={graphic.url} id="lesson-graphic-body" />
        <style jsx>{`
            .lesson-graphic {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                margin: auto;
            }
            #lesson-graphic-body {
                width: ${graphic.sizePct || 100}%;
                height: ${graphic.sizePct || 100}%;
                object-fit: contain;
                animation-duration: 0.3s;
                animation-name: ${'fade-in'};
            }
        `}</style>
    </div>
)

export default ({ graphics }) => (
    <div id="lesson-graphics">
        {graphics.map((graphic, i) => {
            return (
                <LessonGraphic
                    graphic={graphic}
                    key={i}
                    className="lesson-graphic"
                />
            )
        })}
        <style jsx>{`
            #lesson-graphics {
                position: absolute;
                width: 100%;
                height: 100%;
                z-index: 0; // graphic
            }
        `}</style>
    </div>
)
