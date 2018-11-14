import '@babel/polyfill'
import React from 'react'
import { Switch, Route } from 'react-router-dom'

import { IndicatorContext, UserContext } from '../context'
//import Maintenance from './maintenance';
import Home from '../home'
import HowTo from '../howTo'
import TermsOfUse from '../termsOfUse'
import Login from '../login'
import Creator from '../lessonCreator'
import Editor from '../lessonEditor'
import Recorder from '../lessonRecorder'
import PlayerScreen from '../lessonPlayer'

const RoutingComponent = () => (
    // props
    <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/how_to" component={HowTo} />
        <Route exact path="/terms_of_use" component={TermsOfUse} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/lessons/new" component={Creator} />
        <Route exact path="/lessons/:id/edit" component={Editor} />
        <Route exact path="/lessons/:id/record" component={Recorder} />
        <Route exact path="/:id" component={PlayerScreen} />
    </Switch>
)

const Main = () => (
    <main>
        <IndicatorContext.Consumer>
            {({ isLoading, indicatorMessage, updateIndicator }) => (
                <UserContext.Consumer>
                    {(currentUser, updateUser) => (
                        <RoutingComponent
                            isLoading={isLoading}
                            indicatorMessage={indicatorMessage}
                            updateIndicator={updateIndicator}
                            currentUser={currentUser}
                            updateUser={updateUser}
                        />
                    )}
                </UserContext.Consumer>
            )}
        </IndicatorContext.Consumer>
        <style jsx>{`
            main {
                padding-top: 64px;
                padding-bottom: 50px;
                height: 100%;
            }
        `}</style>
    </main>
)

export default Main
