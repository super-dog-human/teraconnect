import React from 'react'
import styled from '@emotion/styled'
import { css } from 'emotion'

export default props => (
    <Modal
        isOpen={props.isOpen}
        closeCallback={() => {
            console.log('back')
            // if (needsConfirm) return
            this.closeModal()
        }}
    >
        <ModalHeader title={props.title} isError={props.isError} />
        <ModalBody message={props.message} />
        <ModalFooter {...props} />
    </Modal>
)

const modalStyle = {}

const Modal = ({ isOpen, closeCallback, children }) => (
    <div
        className={isOpen ? 'modal fade show' : 'modal fade show'}
        style={{
            //            display: isOpen ? 'block' : 'none',
            display: 'none',
            backgroundColor: 'rgba(255, 255, 255, 0.4)',
            color: 'var(--dark-gray)'
        }}
        tabIndex="-1"
        role="dialog"
        onClick={() => {
            console.log('modal clicked')
        }}
        //{close()
    >
        <div className="modal-dialog" role="document">
            <div className="modal-content">{children}</div>
        </div>
    </div>
)

const ModalHeader = ({ title, isError }) => (
    // isError
    <div className="modal-header">
        <h5 className="modal-title">{title}</h5>
        <button
            type="button"
            className="close"
            data-dismiss="modal"
            onClick={() => {
                console.log('closs clicked')
            }}
        >
            <span aria-hidden="true">&times;</span>
        </button>
    </div>
)

const ModalBody = props => <div className="modal-body">{props.message}</div>

const ModalFooter = props => (
    <div className="modal-footer">
        <ModalFooterButton {...props} />
    </div>
)

const ModalFooterButton = props => {
    if (props.needsConfirmModal) {
        return (
            <ModalConfirmButton
                okCallback={props.modalOKCallback}
                cancelCallback={props.modalCancelCallback}
            />
        )
    } else {
        return <ModalCloseButton callback={props.modalCloseCallback} />
    }
}

const ModalConfirmButton = ({ okCancelCallback, cancelCallback }) => (
    <>
        <ModalButton
            type="secondary"
            clickFunction={cancelCallback}
            text="キャンセル"
        />
        <ModalButton
            type="primary"
            clickFunction={okCancelCallback}
            text="OK"
        />
    </>
)

const ModalCloseButton = ({ callback }) => (
    <ModalButton type="secondary" clickFunction={callback} text="閉じる" />
)

const ModalButton = ({ type, clickFunction, text }) => (
    <button
        type="button"
        className={`btn btn-${type}`}
        onClick={() => {
            clickFunction()
            console.log('button clicked')
        }}
    >
        {text}
    </button>
)
