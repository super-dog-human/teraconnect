import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
    <header className="app-back-color-soft-white fixed-top">
        <nav className="navbar navbar-expand-md">
            <ul className="mx-auto nav">
                <li className="nav-item">
                    <div className="navbar-brand" href='/'>
                        <Link to='/'><img src="../../img/logo.png" /></Link>
                    </div>
                </li>
            </ul>
        </nav>
        <style jsx>{`
            header {
                height: 64px;
            }
            .navbar-brand {
                color: #6c7474;
                width: 200px;
                height: 64px;
                padding: 0;
            }
            .navbar-brand img {
                width: 200px;
                height: 64px;
            }
            header > nav {
                padding: 0;
                height: 100%;
            }
            header .nav-item {
                font-size: 18px;
                min-width: 100px;
            }
            header .nav-item > :global(.nav-link) { text-decoration: none; }
            header .nav-item > :global(.nav-link):link { color: #ffffff; }
            header .nav-item > :global(.nav-link):visited { color: #ffffff; }
            header .nav-item > :global(.nav-link):hover { text-decoration: none; color: #ffffff; }
            header .nav-item > :global(.nav-link):active { color: #ffffff; }
        `}</style>
    </header>
)