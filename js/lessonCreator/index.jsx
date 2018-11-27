import React from 'react'
import styled from '@emotion/styled'
import Indicator from '../shared/components/indicator'
import ModalWindow from '../shared/components/modalWindow'
import ReactTooltip from 'react-tooltip'
import AvatarManager from './avatarManager'
import GraphicManager from './graphicManager'
import Cookies from 'js-cookie'
import { isMobile } from 'react-device-detect'
import { postLesson } from '../shared/utils/networkManager'
import { sendExceptionToGA } from '../shared/utils/utility'

const mobileWarningTitle = '非対応の環境です'
const mobileWarningMessage = 'モバイル環境では授業を作成できません。'
const creatingLessonErrorTitle = '授業の作成に失敗しました'

export default class LessonCreator extends React.Component {
    constructor(props) {
        super(props)

        this.lessonID = ''

        this.state = {
            isFormCreatable: false,
            isGraphicCreating: false,
            isAvatarCreating: false,
            isCreating: false,
            isCreated: false,
            title: '',
            description: '',
            avatarID: null,
            graphicIDs: [],
            isModalOpen: false,
            isErrorModal: false,
            modalTitle: '',
            modalMessage: '',
            modalCloseCallback: () => {}
        }
    }

    componentDidMount() {
        const isAgreeToTerms = Cookies.get('agreeToTerms')
        if (isAgreeToTerms !== 'true') {
            this.props.history.replace('/')
            return
        }

        if (!isMobile) return

        this.openErrorModal(mobileWarningTitle, mobileWarningMessage, () => {
            this.props.history.replace('/')
        })
    }

    componentDidUpdate() {
        if (this.state.isCreated) {
            this.props.history.push(`/lessons/${this.lessonID}/record`)
        }
    }

    async handleChangeTitle(event) {
        await this.setState({ title: event.target.value })
        this.switchCreatableForm()
    }

    handleChangeDescription(event) {
        this.setState({ description: event.target.value })
    }

    async handleChangeAvatar(id) {
        await this.setState({ avatarID: id })
        this.switchCreatableForm()
    }

    switchCreatableForm() {
        if (this.state.title.length > 0 && this.state.avatarID != null) {
            this.setState({ isFormCreatable: true })
        } else {
            this.setState({ isFormCreatable: false })
        }
    }

    handleChangeGraphics(graphicIDs) {
        this.setState({ graphicIDs: graphicIDs })
    }

    handleFormSubmit(event) {
        event.preventDefault()

        this.setState({ isCreating: true })

        const lessonBody = {
            title: this.state.title,
            description: this.state.description,
            avatarID: this.state.avatarID,
            graphicIDs: this.state.graphicIDs
        }

        postLesson(lessonBody)
            .then(lesson => {
                this.lessonID = lesson.id
                this.checkCreatingStatus()
            })
            .catch(err => {
                sendExceptionToGA(this.constructor.name, err, false)
                this.openErrorModal(creatingLessonErrorTitle, err, () => {
                    this.setState({ isCreating: false })
                })
            })
    }

    checkCreatingStatus() {
        const interval = setInterval(() => {
            if (!this.state.isGraphicCreating && !this.state.isAvatarCreating) {
                this.setState({ isCreating: false, isCreated: true })
                clearInterval(interval)
            }
        }, 1000)
    }

    openErrorModal(title, message, callback = () => {}) {
        this.setState({
            isModalOpen: true,
            isErrorModal: true,
            modalTitle: title,
            modalMessage: message,
            modalCloseCallback: () => {
                this.closeModal()
                callback()
            }
        })
    }

    closeModal() {
        this.setState({
            isModalOpen: false,
            isErrorModal: '',
            modalTitle: '',
            modalMessage: '',
            modalCloseCallback: () => {}
        })
    }

    render() {
        return (
            <>
                <Indicator isLoading={this.state.isCreating} />
                <ModalWindow
                    isOpen={this.state.isModalOpen}
                    isError={this.state.isErrorModal}
                    title={this.state.modalTitle}
                    message={this.state.modalMessage}
                    onClose={this.state.modalCloseCallback.bind(this)}
                />
                <LessonCreatorScreen className="app-back-color-soft-white">
                    <LessonForm onSubmit={this.handleFormSubmit.bind(this)}>
                        <LessonTitle
                            onChange={this.handleChangeTitle.bind(this)}
                        />
                        <LessonDescription
                            value={this.state.description}
                            onChange={this.handleChangeDescription.bind(this)}
                        />
                        <LessonGraphic
                            onGraphicsChange={this.handleChangeGraphics.bind(
                                this
                            )}
                            onStatusChange={status => {
                                this.setState({
                                    isGraphicCreating: status
                                })
                            }}
                            onError={this.openErrorModal.bind(this)}
                            isCreating={this.state.isGraphicCreating}
                        />
                        <LessonAvatar
                            onAvatarChange={this.handleChangeAvatar.bind(this)}
                            onStatusChange={status => {
                                this.setState({
                                    isAvatarCreating: status
                                })
                            }}
                            isCreating={this.state.isAvatarCreating}
                            onError={this.openErrorModal.bind(this)}
                        />
                        <SubmitButton
                            disabled={
                                !this.state.isFormCreatable ||
                                this.state.isCreating
                            }
                        />
                    </LessonForm>
                    <ReactTooltip
                        className="tooltip"
                        place="top"
                        type="warning"
                    />
                </LessonCreatorScreen>
            </>
        )
    }
}

const LessonCreatorScreen = styled.div`
    padding-top: 50px;
    padding-bottom: 100px;
`

const LessonForm = styled.form`
    width: 80%;
    max-width: 600px;
    margin: auto;
`

const ButtonWithTopMargin = styled.button`
    margin-top: 30px;
`

const SubmitButton = ({ disabled }) => (
    <ButtonWithTopMargin
        type="submit"
        className="btn btn-primary btn-lg"
        disabled={disabled}
    >
        作成
    </ButtonWithTopMargin>
)

const FormLabel = ({ body, isRequired = false }) => {
    const requireSymbol = <span className="text-danger">&nbsp;*</span>
    const label = (
        <label
            htmlFor="lesson-title"
            className="app-text-color-dark-gray font-weight-bold"
        >
            {body}
            {isRequired ? requireSymbol : ''}
        </label>
    )
    return label
}

const LessonTitle = ({ onChange }) => (
    <div className="form-group">
        <FormLabel body="タイトル" isRequired={true} />
        <input
            type="text"
            className="form-control"
            onChange={event => onChange(event)}
            required
        />
    </div>
)

const LessonDescription = ({ value, onChange }) => (
    <div className="form-group">
        <FormLabel body="説明" />
        <textarea
            className="form-control"
            rows="3"
            value={value}
            onChange={onChange}
        />
    </div>
)

const LessonGraphic = ({
    onGraphicsChange,
    onStatusChange,
    isCreating,
    onError
}) => (
    <div className="form-group" data-tip="選択した順で画像が使用できます">
        <FormLabel body="メディア" />
        <GraphicManager
            onGraphicsChange={ids => {
                onGraphicsChange(ids)
            }}
            onStatusChange={status => {
                onStatusChange(status)
            }}
            isCreating={isCreating}
            onError={onError}
        />
    </div>
)

const LessonAvatar = ({
    onAvatarChange,
    onStatusChange,
    isCreating,
    onError
}) => (
    <div className="form-group">
        <FormLabel body="アバター" isRequired={true} />
        <AvatarManager
            onAvatarChange={id => {
                onAvatarChange(id)
            }}
            onStatusChange={status => {
                onStatusChange(status)
            }}
            isCreating={isCreating}
            onError={onError}
        />
    </div>
)
