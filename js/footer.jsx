import React from 'react';

export default () => (
    <footer className="fixed-bottom">
        <div className="text-center app-back-color-dark-gray">
            <a href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2">Teraconnect</a>
        </div>
        <style jsx>{`
        footer > div {
            position: relative;
            width: 100%;
            height: 50px;
        }
        footer > div > a {
            position: absolute;
            color: #ffffff;
            font-size: 14px;
            height: 20px;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;
            margin: auto;
        }
        footer > div > a:hover {
            text-decoration: none;
        }
        `}</style>
    </footer>
)