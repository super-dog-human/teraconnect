import React from 'react';

const LessonGraphic = ({graphic}) => (
    <div className="lesson-graphic">
        <div className="lesson-graphic-body">
            <img src={graphic.url} />
        </div>
        <style jsx>{`
            .lesson-graphic {
                position: absolute;
                top: 0;
                width: 100%;
                height :100%;
                display: table;
            }
            .lesson-graphic-body {
                position: relative;
                display: table-cell;
                text-align: center;
                vertical-align: middle;
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