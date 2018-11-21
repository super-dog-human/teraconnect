import '@babel/polyfill'
import React from 'react'
import { render } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { library } from '@fortawesome/fontawesome-svg-core'
import {
    faDotCircle,
    faPauseCircle,
    faMehBlank
} from '@fortawesome/free-regular-svg-icons'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'
import {
    faPlayCircle,
    faSpinner,
    faImage,
    faArrowUp,
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faLaughBeam,
    faSmile,
    faFrownOpen,
    faAngry,
    faSurprise,
    faWalking,
    faCloudUploadAlt,
    faVideo,
    faFileUpload,
    faFolderPlus,
    faVolumeUp,
    faEdit
} from '@fortawesome/free-solid-svg-icons'
library.add(
    faDotCircle,
    faPauseCircle,
    faMehBlank,
    faPlayCircle,
    faSpinner,
    faImage,
    faArrowUp,
    faArrowDown,
    faArrowLeft,
    faArrowRight,
    faLaughBeam,
    faSmile,
    faFrownOpen,
    faAngry,
    faSurprise,
    faWalking,
    faCloudUploadAlt,
    faVideo,
    faFileUpload,
    faFolderPlus,
    faVolumeUp,
    faEdit,
    faTwitter
)
import Context from './context'
import ErrorBoundary from './errorBoundary'
import Header from './header'
import Main from './main'
import Footer from './footer'
import ReactGA from 'react-ga'
import { GA_TRACKING_ID } from './shared/utils/constants'

ReactGA.initialize(GA_TRACKING_ID)

render(
    <BrowserRouter>
        <Context>
            <ErrorBoundary>
                <Header />
                <Main />
                <Footer />
            </ErrorBoundary>
        </Context>
    </BrowserRouter>,
    document.getElementById('app')
)
