import React from 'react';
import { Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDotCircle, faPauseCircle, faMehBlank } from '@fortawesome/free-regular-svg-icons';
import { faPlayCircle, faSpinner, faImage, faArrowUp, faArrowDown,
    faArrowLeft, faArrowRight, faLaughBeam, faSmile,
    faFrownOpen, faAngry, faSurprise, faWalking, faCloudUploadAlt,
    faVideo, faFileUpload, faFolderPlus, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
library.add( faDotCircle, faPauseCircle, faMehBlank, faPlayCircle, faSpinner, faImage,
    faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faLaughBeam, faSmile, faFrownOpen,
    faAngry, faSurprise, faWalking, faCloudUploadAlt, faVideo, faFileUpload, faFolderPlus,
    faVolumeUp);

import Header from './header'
import Footer from './footer'
import Home from './home'
import Creator from './lessonCreator'
import Editor from './lessonEditor'
import Recorder from './lessonRecorder'
import PlayerScreen from './lessonPlayer'

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
        <Route exact path='/lessons/new'        component={Creator} />
        <Route exact path='/lessons/:id/edit'   component={Editor} />
        <Route exact path='/lessons/:id/record' component={Recorder} />
        <Route exact path='/:id'                component={PlayerScreen} />
        <style jsx>{`
            main {
                padding-top: 64px;
                padding-bottom: 50px;
                height: 100%;
            }
        `}</style>
    </main>
)

export default App