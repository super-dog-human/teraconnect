import React from 'react'
import styled from '@emotion/styled'
import { Switch, Route } from 'react-router-dom'
import AuthRoute from './authRoute'
import Home from '../home'
import AuthCallback from '../AuthCallback'
import HowTo from '../howTo'
import License from '../license'
import TermsOfUse from '../termsOfUse'
import Login from '../login'
import Creator from '../lessonCreator'
import Editor from '../lessonEditor'
import Recorder from '../lessonRecorder'
import Player from '../lessonPlayer'
//import Maintenance from './maintenance';

const Main = styled.main`
    padding-top: 64px;
    padding-bottom: 50px;
    height: 100%;
`

export default () => (
    <Main>
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/_auth_callback" component={AuthCallback} />
            <Route exact path="/how_to" component={HowTo} />
            <Route exact path="/license" component={License} />
            <Route exact path="/terms_of_use" component={TermsOfUse} />
            <Route exact path="/:id" component={Player} />
            <AuthRoute>
                <Switch>
                    <Route exact path="/lessons/new" component={Creator} />
                    <Route exact path="/lessons/:id/edit" component={Editor} />
                    <Route
                        exact
                        path="/lessons/:id/record"
                        component={Recorder}
                    />
                </Switch>
            </AuthRoute>
        </Switch>
    </Main>
)
