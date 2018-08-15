import React from 'react';
import { Route } from 'react-router-dom';

import Header from './header'
import Footer from './footer'
import Home from './home'
import Editor from './lessonEditor/index'
import Recorder from './lessonRecorder/index'
import Player from './lessonPlayer/index'

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
    <Route exact path='/'                   component={Home} />
    <Route exact path='/lessons/:id/edit'   component={Editor} />
    <Route exact path='/lessons/:id/record' component={Recorder} />
    <Route exact path='/:id'                component={Player} />
  </main>
)

export default App