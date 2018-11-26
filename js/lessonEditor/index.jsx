import React from 'react'
import ReactTooltip from 'react-tooltip'
import VoiceText from './voiceText'
import LessonController from '../shared/components/lessonController'
import {
    loadAvatarElement,
    fetchAndMergeGraphicToTimeline,
    mergeVoiceTextToTimeline,
    fetchVoiceURLsToTimelines
} from './utils/lessonMaterialLoader'
import ModalWindow from '../shared/components/modalWindow'
import {
    fetchLesson,
    fetchRawLessonMaterial,
    fetchAvatarObjectURL,
    fetchVoiceTexts,
    deleteLesson,
    updateLesson,
    uploadMaterial,
    packMaterial
} from '../shared/utils/networkManager'
import * as Const from '../shared/utils/constants'
import styled from '@emotion/styled'
import ReactGA from 'react-ga'

const publishingLessonErrorTitle = '授業の公開に失敗しました'
const deletionDoneTitle = '授業を削除しました'
const deletionErrorTitle = '授業の削除に失敗しました'
const confirmPublishingTitle = '授業を公開しますか？'
const confirmPublishingMessage =
    '・授業は約10日間公開され、その後自動で削除されます\n・URLへアクセスすると、誰でも閲覧可能な状態になります'
const confirmDestroyingTitle = '授業を削除しますか？'
const confirmDestroyingMessage = '収録した授業を公開せずに削除します。'

const initModalOption = {
    isError: '',
    title: '',
    message: '',
    onClose: () => {},
    onClickOK: () => {},
    onClickCancel: () => {},
    needsConfirm: false
}

export default class LessonEditor extends React.Component {
    constructor(props) {
        super(props)

        this.lessonID = props.match.params.id

        this.state = {
            isLoading: true,
            isGraphicLoaded: false,
            isTextVoiceLoaded: false,
            avatar: null,
            lesson: {},
            durationSec: 0,
            isPublic: false,
            timelines: [],
            poseKey: {},
            faceKey: {},
            isModalOpen: false,
            modalOption: initModalOption
        }
    }

    async componentDidMount() {
        this.loadMaterials()
    }

    async componentDidUpdate() {
        if (!this.state.isLoading) return

        if (this.state.isGraphicLoaded && this.state.isTextVoiceLoaded) {
            const timelines = await fetchVoiceURLsToTimelines(
                this.lessonID,
                this.state.timelines
            )
            this.setState({ isLoading: false, timelines: timelines })
        }
    }

    async loadMaterials() {
        await this.loadLesson()

        if (this.state.lesson.isPacked) {
            // lesson has been published.
            this.setState({ isTextVoiceLoaded: true, isGraphicLoaded: true })
            this.props.history.push(`/${this.lessonID}`) // FIXME, should editable twice the lesson
            return
        }

        await this.loadRawMaterial()
        await this.loadAvatar()

        await this.setGraphicToTimeline()
        await this.setVoiceTextToTimeline()
    }

    async loadLesson() {
        const lesson = await fetchLesson(this.lessonID)
        this.setState({ lesson: lesson })
    }

    async loadRawMaterial() {
        const material = await fetchRawLessonMaterial(this.lessonID)
        this.setState({
            durationSec: material.durationSec,
            timelines: material.timelines,
            poseKey: material.poseKey,
            faceKey: material.faceKey
        })
    }

    async loadAvatar() {
        const avatarObjectURL = await fetchAvatarObjectURL(
            this.state.lesson.avatar
        )
        const avatar = await loadAvatarElement(
            this.lessonID,
            avatarObjectURL,
            this.playerContainer,
            this.playerElement
        )
        this.setState({ avatar: avatar })
    }

    async setGraphicToTimeline() {
        const allGraphicInitCount = this.state.timelines.filter(t => {
            return t.graphics
        }).length

        if (allGraphicInitCount === 0) {
            this.setState({ isGraphicLoaded: true })
            return
        }

        const timelines = await fetchAndMergeGraphicToTimeline(
            this.state.lesson.graphics,
            this.state.timelines
        )
        this.setState({ timelines: timelines, isGraphicLoaded: true })
    }

    async setVoiceTextToTimeline() {
        const allVoiceInitCount = this.state.timelines.filter(t => {
            return t.voice.id != ''
        }).length // id has blank when not voice.

        if (allVoiceInitCount === 0) {
            this.setState({ isTextVoiceLoaded: true })
            return
        }

        const voiceTexts = await fetchVoiceTexts(this.lessonID)
        if (voiceTexts.length === 0) {
            setTimeout(async () => {
                await this.setVoiceTextToTimeline()
            }, 1000)
            return
        }

        const timelines = mergeVoiceTextToTimeline(
            this.state.timelines,
            voiceTexts
        )
        this.setState({ timelines: timelines })

        if (
            allVoiceInitCount >
            voiceTexts.filter(v => {
                return v.isConverted && v.isTexted
            }).length
        ) {
            setTimeout(async () => {
                await this.setVoiceTextToTimeline()
            }, 1000)
            return
        }

        this.setState({ isTextVoiceLoaded: true })
    }

    changeTimelines(timelines) {
        this.setState({ timelines: timelines })
    }

    changePublic(event) {
        this.setState({ isPublic: event.target.checked })
    }

    confirmPublish() {
        this.openModal({
            title: confirmPublishingTitle,
            message: confirmPublishingMessage,
            onClickOK: () => {
                this.closeModal()
                this.publish()
            },
            onClickCancel: () => {
                this.closeModal()
            },
            isError: false,
            needsConfirm: true
        })
    }

    confirmDestroy() {
        this.openModal({
            title: confirmDestroyingTitle,
            message: confirmDestroyingMessage,
            onClickOK: () => {
                this.closeModal()
                this.destroy()
            },
            onClickCancel: () => {
                this.closeModal()
            },
            isError: false,
            needsConfirm: true
        })
    }

    publish() {
        this.setState({ isLoading: true })

        const lesson = {
            id: this.lessonID,
            version: this.state.lesson.version + 1,
            durationSec: this.state.durationSec,
            timelines: this.state.timelines,
            poseKey: this.state.poseKey,
            faceKey: this.state.faceKey,
            isPublic: this.state.isPublic
        }

        this.publishLesson(lesson)
            .then(() => {
                this.props.history.push(`/${this.lessonID}`)
            })
            .catch(err => {
                ReactGA.exception({ description: err.message, fatal: false })
                this.setState({ isLoading: false })
                this.openModal({
                    title: publishingLessonErrorTitle,
                    message: err
                })
            })
    }

    async publishLesson(lesson) {
        const lessonBody = {
            durationSec: lesson.durationSec,
            version: lesson.version,
            isPublic: lesson.isPublic
        }
        await updateLesson(lesson.id, lessonBody)

        const materialBody = {
            durationSec: lesson.durationSec,
            timelines: lesson.timelines,
            poseKey: lesson.poseKey,
            faceKey: lesson.faceKey
        }
        await uploadMaterial(lesson.id, materialBody)
        await packMaterial(lesson.id)
    }

    async destroy() {
        await this.setState({ isLoading: true })

        deleteLesson(this.lessonID)
            .then(() => {
                this.setState({ isLoading: false })
                this.openModal({
                    title: deletionDoneTitle,
                    onClose: () => {
                        this.closeModal()
                        this.props.history.push('/')
                    },
                    isError: false
                })
            })
            .catch(err => {
                ReactGA.exception({
                    description: `${err.message} ${err.stack}`,
                    fatal: false
                })
                this.setState({ isLoading: false })
                this.openModal({ title: deletionErrorTitle, message: err })
            })
    }

    openModal(option) {
        this.setState({ isModalOpen: true, modalOption: option })
    }

    closeModal() {
        this.setState({ isModalOpen: false, modalOption: initModalOption })
    }

    render() {
        return (
            <>
                <ModalWindow
                    isOpen={this.state.isModalOpen}
                    {...this.state.modalOption}
                />
                <LessonEditorContainer className="app-back-color-dark-gray">
                    <div className="container-fluid">
                        <LessonControlPanel>
                            <div className="row">
                                <div className="col text-right">
                                    <LessonControlButton
                                        className="btn btn-primary btn-lg"
                                        onClick={this.confirmPublish.bind(this)}
                                        disabled={this.state.isLoading}
                                        data-tip="授業を公開状態にします"
                                    >
                                        授業を公開する
                                    </LessonControlButton>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col text-right">
                                    <LessonControlButton
                                        className="btn btn-danger btn-lg"
                                        onClick={this.confirmDestroy.bind(this)}
                                        disabled={this.state.isLoading}
                                        data-tip="授業をすぐに削除します"
                                    >
                                        削除する
                                    </LessonControlButton>
                                </div>
                            </div>
                        </LessonControlPanel>
                        <div className="row">
                            <VoiceTextEditorContainer className="col-lg-7">
                                <LessonEditorTitle className="app-text-color-soft-white">
                                    テキスト編集
                                </LessonEditorTitle>
                                <VoiceText
                                    isLoading={this.state.isLoading}
                                    lessonID={this.lessonID}
                                    timelines={this.state.timelines}
                                    changeTimelines={this.changeTimelines.bind(
                                        this
                                    )}
                                />
                            </VoiceTextEditorContainer>
                            <LessonPreviewContainer className="col-lg-5">
                                <LessonEditorTitle className="app-text-color-soft-white mb-4">
                                    プレビュー
                                </LessonEditorTitle>
                                <div
                                    className="app-back-color-soft-white m-2"
                                    ref={e => {
                                        this.playerContainer = e
                                    }}
                                >
                                    <LessonController
                                        avatar={this.state.avatar}
                                        lesson={{
                                            durationSec: this.state.durationSec,
                                            timelines: this.state.timelines,
                                            poseKey: this.state.poseKey,
                                            faceKey: this.state.faceKey
                                        }}
                                        isLoading={this.state.isLoading}
                                        ref={e => {
                                            this.playerElement = e
                                        }}
                                    />
                                </div>
                            </LessonPreviewContainer>
                        </div>
                    </div>
                    <ReactTooltip
                        className="tooltip"
                        place="bottom"
                        type="warning"
                    />
                </LessonEditorContainer>
            </>
        )
    }
}

const LessonControlButton = styled.button`
    width: 150px;
    margin-bottom: 20px;
    font-size: 17px;
`

const LessonEditorContainer = styled.div`
    width: 100%;
    height: 100%;
`

const LessonEditorTitle = styled.h5`
    font-size: 1vw;
    margin-left: 1vw;
`

const LessonControlPanel = styled.div`
    padding-top: 20px;
    padding-right: 20px;
`
const VoiceTextEditorContainer = styled.div`
    position: relative;
    max-height: 100%;
`

const LessonPreviewContainer = styled.div`
    width: 38vw;
    height: ${38 / Const.RATIO_9_TO_16}vw;
`
