import React from 'react'
import { css } from 'emotion'

const initProps = {
    isOpen: false,
    isError: false,
    title: '',
    message: '',
    onClose: () => {},
    onClickOK: () => {},
    onClickCancel: () => {},
    needsConfirm: false,
    okButtonLabel: 'OK',
    cancelButtonLabel: 'キャンセル'
}

export default props => {
    props = { ...initProps, ...props }

    return (
        <Modal
            className={props.isOpen ? 'modal fade show' : 'modal fade'}
            isOpen={props.isOpen}
            onClose={props.onClose}
            needsConfirm={props.needsConfirm}
        >
            <ModalHeader {...props} />
            <ModalBody
                onClick={e => e.stopPropagation()}
                message={props.message}
            />
            <ModalFooter {...props} />
        </Modal>
    )
}

const Modal = ({ isOpen, onClose, needsConfirm, children }) => {
    const modalStyle = css`
        display: ${isOpen ? 'block' : 'none'};
        background-color: rgba(255, 255, 255, 0.4);
        color: var(--dark-gray);
    `

    return (
        <div
            className={`${modalStyle} ${isOpen ? 'show' : ''} modal fade`}
            tabIndex="-1"
            role="dialog"
            onClick={() => {
                if (needsConfirm) return
                onClose() // for backgound clicking
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
            onClick={onClose}
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

const modalBodyStyle = css`
    font-size: 0.9rem;
    white-space: pre-wrap;
    padding: 20px;
`

const ModalBody = ({ message }) => (
    <div className={modalBodyStyle}>{message}</div>
)

const ModalFooter = props => {
    const ModalFooterButton = props => {
        if (props.needsConfirm) {
            return <ModalConfirmButton {...props} />
        } else {
            return <ModalCloseButton onClose={props.onClose} />
        }
    }

    const ModalConfirmButton = ({
        onClickCancel,
        onClickOK,
        cancelButtonLabel,
        okButtonLabel
    }) => (
        <>
            <ModalButton
                type="secondary"
                callback={onClickCancel}
                text={cancelButtonLabel}
            />
            <ModalButton
                type="primary"
                callback={onClickOK}
                text={okButtonLabel}
            />
        </>
    )

    const ModalCloseButton = ({ onClose }) => (
        <ModalButton type="secondary" callback={onClose} text="閉じる" />
    )

    const ModalButton = ({ type, callback, text }) => (
        <button type="button" className={`btn btn-${type}`} onClick={callback}>
            {text}
        </button>
    )

    return (
        <div className="modal-footer">
            <ModalFooterButton {...props} />
        </div>
    )
}
