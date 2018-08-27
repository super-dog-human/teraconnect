import React from 'react';
import { Link } from 'react-router-dom';

export default ({selectedIndex}) => (
    <div id="menu">
        <nav expand="md" className="app-color-beige navbar navbar-expand-md">
            <ul className="mx-auto nav">
                <li className="nav-item">
                    <Link className="nav-link" to='#'>レビュー</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='#'>授業を作る</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='#'>教材を作る</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to='#'>分析</Link>
                </li>
            </ul>
        </nav>
        <style jsx>{`
            .navbar {
                height: 55px;
            }
            .nav-item {
                padding-top: 6px;
                display: block;
                min-width: 120px;
                text-align: center;
                font-weight: bold;
            }
            .nav-item::after {
                padding-top: 3px;
                display: block;
                content: "";
                background-color: #E5DFCE;
                height: 3px;
            }
            .nav-item:hover::after {
                display: block;
                background-color: #EC9F05;
            }
            .nav-item:nth-of-type(${selectedIndex})::after {
                display: block;
                background-color: #EC9F05;
            }
            .nav-item > :global(.nav-link) { text-decoration: none; color: red; }
            .nav-item > :global(.nav-link):link { color: #616163; }
            .nav-item > :global(.nav-link):visited { color: #616163; }
            .nav-item > :global(.nav-link):hover { color: #616163; }
            .nav-item > :global(.nav-link):active { color: #616163; }
        `}</style>
    </div>
)
