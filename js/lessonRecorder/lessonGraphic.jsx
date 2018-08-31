import React from 'react';

export default ({graphicURL}) => (
    <div className="lesson-graphic">
        <div className="lesson-graphic-cell">
            <img src={graphicURL} id="lesson-graphic-body" />
        </div>
        <style jsx>{`
            .lesson-graphic {
                position: absolute;
                top: 0;
                width: 100%;
                height :100%;
                display: table;
                z-index: -100;
            }
            .lesson-graphic-cell {
                position: relative;
                display: table-cell;
                text-align: center;
                vertical-align: center;
            }
            #lesson-graphic-body {
                width: 90%;
                max-height: 90%;
                object-fit: contain;
                animation-duration: 0.1s;
                animation-name: ${'fade-in'};
            }
        `}</style>
    </div>
)