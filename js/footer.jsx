import React from 'react';

const Footer = () => (
    <footer className="app-color-dark-navy fixed-bottom">
        <div>ZYGOPTERA</div>
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
        `}</style>
    </footer>
)

export default Footer