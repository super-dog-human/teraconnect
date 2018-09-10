import React from 'react';
import { Link } from 'react-router-dom';

export default () => (
    <header className="app-color-dark-navy fixed-top">
        <nav className="navbar navbar-expand-md">
            <div id="app-logo" className="pull-left">
                TeraConnect
            </div>

            <ul className="mx-auto nav">
                <li className="nav-item">
                    <Link className="nav-link" to='/'>ホーム</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='/lessons/new'>授業収録</Link>
                </li>
            </ul>
        </nav>
        <style jsx>{`
            header {
                height: 64px;
            }
            #app-logo {
                color: white;
            }
            #app-logo img {
                width: 50px;
                height: 64px;
            }
            header > nav {
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