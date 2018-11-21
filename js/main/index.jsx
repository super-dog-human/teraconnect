import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { UserContext } from '../context'
//import Maintenance from './maintenance';
import Home from '../home'
import HowTo from '../howTo'
import License from '../license'
import TermsOfUse from '../termsOfUse'
import Login from '../login'
import Creator from '../lessonCreator'
import Editor from '../lessonEditor'
import Recorder from '../lessonRecorder'
import Player from '../lessonPlayer'

const RoutedComponent = contextProps => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/how_to" component={HowTo} />
        <Route exact path="/license" component={License} />
        <Route
            exact
            path="/terms_of_use"
            render={props => <TermsOfUse {...props} {...contextProps} />}
        />
        <Route
            exact
            path="/login"
            render={props => <Login {...props} {...contextProps} />}
        />
        <Route
            exact
            path="/lessons/new"
            render={props => <Creator {...props} {...contextProps} />}
        />
        <Route
            exact
            path="/lessons/:id/edit"
            render={props => <Editor {...props} {...contextProps} />}
        />
        <Route
            exact
            path="/lessons/:id/record"
            render={props => <Recorder {...props} {...contextProps} />}
        />
        <Route
            exact
            path="/:id"
            render={props => <Player {...props} {...contextProps} />}
        />
    </Switch>
)

export default () => (
    <main>
        <UserContext.Consumer>
            {({ currentUser, updateUser }) => (
                <RoutedComponent {...{ currentUser, updateUser }} />
            )}
        </UserContext.Consumer>
        <style jsx>{`
            main {
                padding-top: 64px;
                padding-bottom: 50px;
                height: 100%;
            }
        `}</style>
    </main>
)
