import React from 'react'
import { ModalContext } from '../context'

export default class ModalWindow extends React.Component {
    static contextType = ModalContext

    render() {
        return (
            //this.context.isModalOpen
            <div>
                <div>{this.context.modalMessage}</div>
            </div>
        )
    }
}
