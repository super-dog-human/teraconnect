import React from 'react'
import { css } from 'emotion'

export default props => (
    <Modal
        isOpen={props.isOpen}
        onClose={props.onClose}
        needsConfirm={props.needsConfirm}
    >
        <ModalHeader {...props} />
        <ModalBody message={props.message} onClick={e => e.stopPropagation()} />
        <ModalFooter {...props} />
    </Modal>
)

const Modal = ({ isOpen, onClose, needsConfirm, children }) => {
    const modalStyle = css`
        display: block;
        background-color: rgba(255, 255, 255, 0.4);
        color: var(--dark-gray);
    `

    return (
        <div
            className={`${modalStyle} ${
                isOpen ? 'modal fade show' : 'modal fade'
            }`}
            tabIndex="-1"
            role="dialog"
            onClick={() => {
                if (needsConfirm) return
                onClose()
            }}
        >
            <div className="modal-dialog" role="document">
                <div
                    className="modal-content"
                    onClick={e => {
                        e.stopPropagation() // don't close modal when clicking content
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    )
}

const ModalHeader = props => {
    const ModalCrossButton = ({ onClose }) => (
        <button
            type="button"
            className="close"
            data-dismiss="modal"
            onClick={() => {
                onClose()
            }}
        >
            <span aria-hidden="true">&times;</span>
        </button>
    )

    return (
        <div className="modal-header">
            <h5
                className={
                    props.isError ? 'modal-title text-danger' : 'modal-title'
                }
            >
                {props.title}
            </h5>
            {props.needsConfirm ? (
                ''
            ) : (
                <ModalCrossButton onClose={props.onClose} />
            )}
        </div>
    )
}

const ModalBody = props => <div className="modal-body">{props.message}</div>

const ModalFooter = props => {
    const ModalFooterButton = props => {
        if (props.needsConfirm) {
            return (
                <ModalConfirmButton
                    onClickCancel={() => props.onClickCancel()}
                    onClickOK={() => {
                        props.onClickOK()
                    }}
                />
            )
        } else {
            return <ModalCloseButton onClose={props.onClose} />
        }
    }

    const ModalConfirmButton = ({ onClickCancel, onClickOK }) => (
        <>
            <ModalButton
                type="secondary"
                clickFunction={onClickCancel}
                text="キャンセル"
            />
            <ModalButton type="primary" callback={onClickOK} text="OK" />
        </>
    )

    const ModalCloseButton = ({ onClose }) => (
        <ModalButton type="secondary" callback={onClose} text="閉じる" />
    )

    const ModalButton = ({ type, callback, text }) => (
        <button
            type="button"
            className={`btn btn-${type}`}
            onClick={() => {
                callback()
            }}
        >
            {text}
        </button>
    )

    return (
        <div className="modal-footer">
            <ModalFooterButton {...props} />
        </div>
    )
}
