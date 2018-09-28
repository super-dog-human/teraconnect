import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './app'

import 'babel-polyfill';

ReactDOM.render((
    <BrowserRouter>
        <div>
            <App />
        </div>
    </BrowserRouter>
),  document.getElementById('app'))
