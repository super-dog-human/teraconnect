import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faDotCircle, faPauseCircle, faMehBlank } from '@fortawesome/free-regular-svg-icons';
import { faPlayCircle, faSpinner, faImage, faArrowUp, faArrowDown,
    faArrowLeft, faArrowRight, faLaughBeam, faSmile,
    faFrownOpen, faAngry, faSurprise, faWalking, faCloudUploadAlt,
    faVideo, faFileUpload, faFolderPlus, faVolumeUp, faEdit } from '@fortawesome/free-solid-svg-icons';
library.add( faDotCircle, faPauseCircle, faMehBlank, faPlayCircle, faSpinner, faImage,
    faArrowUp, faArrowDown, faArrowLeft, faArrowRight, faLaughBeam, faSmile, faFrownOpen,
    faAngry, faSurprise, faWalking, faCloudUploadAlt, faVideo, faFileUpload, faFolderPlus,
    faVolumeUp, faEdit);

import Header from './header';
import Footer from './footer';
import Home from './home';
import HowTo from './howTo';
//import Maintenance from './maintenance';
import TermsOfUse from './termsOfUse';
import Creator from './lessonCreator';
import Editor from './lessonEditor';
import Recorder from './lessonRecorder';
import PlayerScreen from './lessonPlayer';

const App = () => (
    <div>
        <Header />
        <Main />
        <Footer />
    </div>
)

const Main = () => (
    <main>
        <Switch>
            <Route exact path='/'                   component={Home} />
            <Route exact path='/how_to'             component={HowTo} />
            <Route exact path='/terms_of_use'       component={TermsOfUse} />
            <Route exact path='/lessons/new'        component={Creator} />
            <Route exact path='/lessons/:id/edit'   component={Editor} />
            <Route exact path='/lessons/:id/record' component={Recorder} />
            <Route exact path='/:id'                component={PlayerScreen} />
        </Switch>
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