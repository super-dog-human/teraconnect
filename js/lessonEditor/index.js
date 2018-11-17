import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import ReactTooltip from 'react-tooltip'
import VoiceText from './voiceText'
import LessonController from '../shared/components/lessonController'
import LessonMaterialLoader from './lessonMaterialLoader'
import {
    fetchLesson,
    fetchRawLessonMaterial,
    fetchAvatarObjectURL,
    fetchVoiceTexts,
    deleteLesson,
    updateLesson,
    uploadMaterial,
    packMaterial
} from '../common/networkManager'
import * as Const from '../common/constants'

export default class LessonEditor extends React.Component {
    constructor(props) {
        super(props)

        this.lessonID = props.match.params.id

        this.state = {
            isLoading: true,
            isUpdating: false,
            isGraphicLoaded: false,
            isTextVoiceLoaded: false,
            avatar: null,
            lesson: {},
            durationSec: 0,
            isPublic: false,
            timelines: [],
            poseKey: {},
            faceKey: {}
        }

        this.loader = new LessonMaterialLoader(this.lessonID)
    }

    async componentDidMount() {
        this.loadMaterials().catch(err => {
            console.error(err)
            // error modal
        })
    }

    async componentDidUpdate() {
        if (!this.state.isLoading) return

        if (this.state.isGraphicLoaded && this.state.isTextVoiceLoaded) {
            const timelines = await this.loader.fetchVoiceURLsToTimelines(
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
            this.props.history.push(`/${this.lessonID}`) // FIXME
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
        const avatar = await this.loader.loadAvatar(
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

        if (allGraphicInitCount == 0) {
            this.setState({ isGraphicLoaded: true })
            return
        }

        const timelines = await this.loader.fetchAndMergeGraphicToTimeline(
            this.state.lesson.graphics,
            this.state.timelines
        )
        this.setState({ timelines: timelines, isGraphicLoaded: true })
    }

    async setVoiceTextToTimeline() {
        const allVoiceInitCount = this.state.timelines.filter(t => {
            return t.voice.id != ''
        }).length // id has blank when not voice.

        if (allVoiceInitCount == 0) {
            this.setState({ isTextVoiceLoaded: true })
            return
        }

        const voiceTexts = await fetchVoiceTexts(this.lessonID)
        if (voiceTexts.length == 0) {
            setTimeout(async () => {
                await this.setVoiceTextToTimeline()
            }, 1000)
            return
        }

        const timelines = await this.loader.fetchAndMergeVoiceTextToTimeline(
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

    async confirmPublish() {
        const result = confirm(
            '授業を公開しますか？\n\n・授業は約10日間公開され、その後自動で削除されます\n・再生画面のURLへアクセスすると、誰でも閲覧可能な状態になります'
        )
        if (result) {
            this.publish()
        }
    }

    async confirmDestroy() {
        const result = confirm('収録した授業を、公開せずに削除しますか？')
        if (result) this.destroy()
    }

    async publish() {
        this.setState({ isUpdating: true })

        const lesson = {
            id: this.lessonID,
            version: this.state.lesson.version + 1,
            durationSec: this.state.durationSec,
            timelines: this.state.timelines,
            poseKey: this.state.poseKey,
            faceKey: this.state.faceKey,
            isPublic: this.state.isPublic
        }

        await this.publishLesson(lesson).catch(err => {
            this.setState({ isUpdating: false })
            console.error(err)
            alert(
                '授業の公開に失敗しました。再度試しても失敗する場合は、運営者に連絡してください。'
            )
            return
        })

        this.setState({ isUpdating: false })
        this.props.history.push(`/${this.lessonID}`)
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
        this.setState({ isLoading: true })

        const result = await deleteLesson(this.lessonID).catch(err => {
            console.error(err)
            return false
        })

        this.setState({ isLoading: false })

        if (result) {
            alert('授業を削除しました。')
            location.href = '/'
        } else {
            alert(
                '授業の削除に失敗しました。再度試しても失敗する場合は、運営者に連絡してください。'
            )
        }
    }

    render() {
        return (
            <div id="lesson-editor" className="app-back-color-dark-gray">
                <div className="container-fluid">
                    <div id="lesson-control-panel">
                        <div className="row">
                            <div className="col text-right">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={this.confirmPublish.bind(this)}
                                    disabled={this.state.isLoading}
                                    data-tip="授業を公開状態にします"
                                >
                                    授業を公開する
                                </button>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col text-right">
                                <button
                                    className="btn btn-danger btn-lg"
                                    onClick={this.confirmDestroy.bind(this)}
                                    disabled={this.state.isLoading}
                                    data-tip="授業をすぐに破棄します"
                                >
                                    破棄する
                                </button>
                                {/*
                                <div id="publish-checkbox" className="form-check">
                                    <input type="checkbox" id="is-publish-checkbox" onChange={this._changePublic.bind(this)} />
                                    <label htmlFor="is-publish-checkbox" className="app-text-color-soft-white" data-tip="トップページに作成した授業のリンクを表示します">&nbsp;一般公開</label>
                                </div>
                                */}
                            </div>
                        </div>
                    </div>
                    <div id="editor-body" className="row">
                        <div id="text-editor" className="col-lg-7">
                            <h5 className="app-text-color-soft-white">
                                テキスト編集
                            </h5>
                            <VoiceText
                                isLoading={this.state.isLoading}
                                lessonID={this.lessonID}
                                timelines={this.state.timelines}
                                changeTimelines={this.changeTimelines.bind(
                                    this
                                )}
                            />
                            <div id="text-loading-indicator">
                                <FontAwesomeIcon icon="spinner" spin />
                            </div>
                        </div>
                        <div className="col-lg-5">
                            <h5 className="app-text-color-soft-white mb-4">
                                プレビュー
                            </h5>
                            <div
                                id="lesson-preview"
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
                                    isPreview={true}
                                    ref={e => {
                                        this.playerElement = e
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <ReactTooltip
                    className="tooltip"
                    place="bottom"
                    type="warning"
                />
                <style jsx>{`
                    #lesson-editor {
                        opacity: ${this.state.isLoading ? '0.8' : '1'};
                        width: 100%;
                        height: 100%;
                    }
                    #lesson-control-panel {
                        padding-top: 20px;
                        padding-right: 20px;
                    }
                    #lesson-control-panel button {
                        width: 150px;
                        margin-bottom: 20px;
                        font-size: 17px;
                    }
                    #publish-checkbox {
                        display: none;
                        margin-top: 10px;
                        font-size: 13px;
                    }
                    #publish-checkbox label {
                        cursor: pointer;
                    }
                    #editor-body h5 {
                        font-size: 1vw;
                        margin-left: 1vw;
                    }
                    #text-editor {
                        position: relative;
                        max-height: 100%;
                    }
                    #text-loading-indicator {
                        position: absolute;
                        z-index: 300; // indicator
                        width: 10vw;
                        height: 10vw;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        display: ${this.state.isLoading || this.state.isUpdating
                ? 'display'
                : 'none'};
                        font-size: 10vw;
                        opacity: 0.5;
                    }
                    #lesson-preview {
                        width: 38vw;
                        height: ${38 / Const.RATIO_9_TO_16}vw;
                    }
                `}</style>
            </div>
        )
    }
}
