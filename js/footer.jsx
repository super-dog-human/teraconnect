import React from 'react';

const Footer = () => (
    <footer className="app-color-dark-gray fixed-bottom">
        <div><a href="https://goo.gl/forms/Rmp3dNKN7ZsDoF2k2">ZYGOPTERA</a></div>
        <style jsx>{`
        footer {
            height: 50px;
        }
        footer > div {
            padding-top: 14px;
            text-align: center;
            color: #ffffff;
            font-size: 14px;
        }
        footer a {
            color: #ffffff;
        }
        footer a:hover {
            text-decoration: none;
        }
        `}</style>
    </footer>
)

export default Footer