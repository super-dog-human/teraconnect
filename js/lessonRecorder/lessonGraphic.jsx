import React from 'react'
// TODO add spinner until loaded image.
export default ({ url }) => (
    <div id="lesson-graphic">
        <img src={url} id="lesson-graphic-body" />
        <style jsx>{`
            #lesson-graphic {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100%;
                height: 100%;
                margin: auto;
                z-index: 0; // graphics
            }
            #lesson-graphic-body {
                display: ${url != '' ? 'block' : 'none'};
                width: 100%;
                height: 100%;
                object-fit: contain;
                animation-duration: 0.3s;
                animation-name: ${'fade-in'};
            }
        `}</style>
    </div>
)
