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
import { whyDidYouUpdate } from 'why-did-you-update'
import ErrorBoundary from './errorBoundary'
import Header from './header'
import Main from './main'
import Footer from './footer'
import { isProduction } from './shared/utils/utility'

if (!isProduction()) {
    whyDidYouUpdate(React)
}

render(
    <BrowserRouter>
        <ErrorBoundary>
            <Header />
            <Main />
            <Footer />
        </ErrorBoundary>
    </BrowserRouter>,
    document.getElementById('app')
)
