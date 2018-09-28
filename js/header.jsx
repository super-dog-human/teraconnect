import React from 'react';
import { Link } from 'react-router-dom';

export default ({selectedIndex}) => (
    <header className="app-back-color-dark-navy fixed-top">
        <div className="d-flex justify-content-right">
            <span id="app-logo" className="mr-auto">
                <Link to='/'><img src="../../img/logo-beta.png" /></Link>
            </span>
            <span className="link-text">
                <Link className="nav-link font-weight-light" to='/how_to'>使い方</Link>
            </span>
        </div>
        <style jsx>{`
            header {
                height: 64px;
            }
            #app-logo {
                color: #6c7474;
                width: 200px;
                height: 64px;
                padding: 0;
                margin-left: 50px;
            }
            #app-logo img {
                width: 200px;
                height: 64px;
            }
            .link-text {
                color: #ebe9e9;
                font-size: 16px;
                min-width: 100px;
                margin-left: 10px;
                margin-right: 10px;
                text-align: center;
                line-height: 64px;
            }
            .link-text::after {
                display: block;
                content: "";
                background-color: #247494;
                margin-top: -3px;
                height: 3px;
            }
            .link-text:hover::after {
                background-color: #ec9f05;
            }
            .link-text:nth-of-type(${selectedIndex})::after {
                background-color: #ec9f05;
            }
            .link-text > :global(.nav-link) { text-decoration: none; padding: 0; }
            .link-text > :global(.nav-link):link { color: #ebe9e9; }
            .link-text > :global(.nav-link):visited { color: #ebe9e9; }
            .link-text > :global(.nav-link):hover { text-decoration: none; color: #ebe9e9; }
            .link-text > :global(.nav-link):active { color: #ebe9e9; }
            .disabled-link {
                cursor: not-allowed;
            }
        `}</style>
    </header>
)