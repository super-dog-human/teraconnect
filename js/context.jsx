import React from 'react'

export const UserContext = React.createContext()

export default class Context extends React.Component {
    constructor() {
        super()

        this.state = {
            currentUser: null
        }
        // TODO get user by localstorage token.
    }

    updateUser(user) {
        this.setState({ currentUser: user })
    }

    render() {
        return (
            <UserContext.Provider
                value={{
                    currentUser: this.state.currentUser,
                    updateUser: this.updateUser.bind(this)
                }}
            >
                {this.props.children}
            </UserContext.Provider>
        )
    }
}
