import axios from 'axios';
import React from 'react';
import { Route } from 'react-router-dom';

import Header from './header'
import Footer from './footer'
import Home from './home'
import Lessons from './lessons/index'

const API_URL = "https://api.teraconnect.org/voice_text/";

const App = () => (
  <div>
    <Header />
    <Main />
    <Footer />
  </div>
)

const Main = () => (
  <main>
    <Route exact path='/'            component={Home} />
    <Route exact path='/lessons/:id' component={Lessons} />
  </main>
)

export default App