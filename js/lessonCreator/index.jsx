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
        this.title = ''
        this.description = ''
        this.avatarID = ''
        this.graphicIDs = []
        this.state = {
            isFormCreatable: false,
            isGraphicCreating: false,
            isAvatarCreating: false,
            isCreating: false,
            isCreated: false,
            isModalOpen: false,
            modalOption: {}
        }
    }

    componentDidMount() {
        const isAgreeToTerms = Cookies.get('agreeToTerms')
        if (isAgreeToTerms !== 'true') {
            this.props.history.replace('/')
            return
        }

        if (!isMobile) return

        this.openModal({
            title: mobileWarningTitle,
            message: mobileWarningMessage,
            onClose: () => {
                this.closeModal()
                this.props.history.replace('/')
            }
        })
    }

    componentDidUpdate() {
        if (this.state.isCreated) {
            this.props.history.push(`/lessons/${this.lessonID}/record`)
        }
    }

    handleChangeTitle(event) {
        this.title = event.target.value
        this.switchCreatableForm()
    }

    handleChangeDescription(event) {
        this.description = event.target.value
    }

    async handleChangeAvatar(id) {
        this.avatarID = id
        this.switchCreatableForm()
    }

    switchCreatableForm() {
        const isFormCreatable = this.title.length > 0 && this.avatarID != ''
        if (this.state.isFormCreatable != isFormCreatable) {
            this.setState({ isFormCreatable: isFormCreatable })
        }
    }

    handleChangeGraphics(graphicIDs) {
        this.graphicIDs = graphicIDs
    }

    handleFormSubmit(event) {
        event.preventDefault()

        this.setState({ isCreating: true })

        const lessonBody = {
            title: this.title,
            description: this.description,
            avatarID: this.avatarID,
            graphicIDs: this.graphicIDs
        }

        postLesson(lessonBody)
            .then(lesson => {
                this.lessonID = lesson.id
                this.checkCreatingStatus()
            })
            .catch(err => {
                sendExceptionToGA(this.constructor.name, err, false)
                this.openModal({
                    title: creatingLessonErrorTitle,
                    message: err.message,
                    onClose: () => {
                        this.closeModal()
                        this.setState({ isCreating: false })
                    }
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

    openModal(option) {
        this.setState({ isModalOpen: true, modalOption: option })
    }

    closeModal() {
        this.setState({ isModalOpen: false, modalOption: {} })
    }

    render() {
        return (
            <>
                <Indicator isLoading={this.state.isCreating} />
                <ModalWindow
                    isOpen={this.state.isModalOpen}
                    {...this.state.modalOption}
                />
                <LessonCreatorContainer className="app-back-color-soft-white">
                    <LessonForm onSubmit={this.handleFormSubmit.bind(this)}>
                        <LessonTitle
                            onChange={this.handleChangeTitle.bind(this)}
                        />
                        <LessonDescription
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
                            openModal={this.openModal.bind(this)}
                            closeModal={this.closeModal.bind(this)}
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
                            openModal={this.openModal.bind(this)}
                            closeModal={this.closeModal.bind(this)}
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
                </LessonCreatorContainer>
            </>
        )
    }
}

const LessonCreatorContainer = styled.div`
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

const LessonGraphic = props => (
    <div className="form-group" data-tip="選択した順で画像が使用できます">
        <FormLabel body="メディア" />
        <GraphicManager {...props} />
    </div>
)

const LessonAvatar = props => (
    <div className="form-group">
        <FormLabel body="アバター" isRequired={true} />
        <AvatarManager {...props} />
    </div>
)
