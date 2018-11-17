import React from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import { isMobile } from 'react-device-detect'
import ReactTooltip from 'react-tooltip'
import AvatarManager from './avatarManager'
import GraphicManager from './graphicManager'
import * as Const from '../common/constants'

export default class LessonCreator extends React.Component {
    constructor(props) {
        super(props)

        this.lessonID = ''

        this.state = {
            isFormCreatable: false,
            isGraphicCreating: false,
            isAvatarCreating: false,
            isCreating: false,
            title: '',
            description: '',
            avatarID: null,
            graphicIDs: []
        }
    }

    componentDidMount() {
        if (isMobile) {
            alert(
                'モバイル環境では授業を作成できないよ…\n正式版の公開までもう少し待っててね！'
            )
            location.href = '/'
        }
    }

    componentDidUpdate(_, prevState) {
        if (!prevState.isCreating && this.state.isCreating) {
            this.props.updateIndicator({ isLoading: true })
        }

        if (prevState.isCreating && !this.state.isCreating) {
            this.props.updateIndicator({ isLoading: false })
            this.props.history.push(`/lessons/${this.lessonID}/record`)
        }
    }

    async changeTitle(event) {
        await this.setState({ title: event.target.value })
        this.checkSelectedMaterial()
    }

    changeDescription(event) {
        this.setState({ description: event.target.value })
    }

    async changeAvatar(id) {
        await this.setState({ avatarID: id })
        this.checkSelectedMaterial()
    }

    changeGraphics(graphicIDs) {
        this.setState({ graphicIDs: graphicIDs })
    }

    checkSelectedMaterial() {
        if (this.state.title.length > 0 && this.state.avatarID != null) {
            this.setState({ isFormCreatable: true })
        } else {
            this.setState({ isFormCreatable: false })
        }
    }

    async create(event) {
        event.preventDefault()
        this.setState({ isCreating: true })

        const lesson = await this.postLesson().catch(err => {
            console.error(err)
            return false
        })

        if (!lesson) {
            // error modal
            return
        }

        this.lessonID = lesson.id
        this.checkCreatingStatus()
    }

    checkCreatingStatus() {
        const interval = setInterval(() => {
            if (!this.state.isGraphicCreating && !this.state.isAvatarCreating) {
                this.setState({ isCreating: false })
                clearInterval(interval)
            }
        }, 1000)
    }

    async postLesson() {
        const body = {
            title: this.state.title,
            description: this.state.description,
            avatarID: this.state.avatarID,
            graphicIDs: this.state.graphicIDs
        }
        const url = Const.LESSON_API_URL.replace('{lessonID}', '') // API URL has no id when creating new.
        const result = await axios.post(url, body).catch(err => {
            throw new Error(err)
        })

        return result.data
    }

    render() {
        const isAgreeToTerms = Cookies.get('agreeToTerms')
        if (isAgreeToTerms !== 'true') {
            location.href = '/'
            return
        }

        return (
            <div id="lesson-creator-screen" className="">
                <div id="lesson-creator" className="app-back-color-soft-white">
                    <form id="lesson-form" onSubmit={this.create.bind(this)}>
                        <div className="form-group">
                            <label
                                htmlFor="lesson-title"
                                className="app-text-color-dark-gray font-weight-bold"
                            >
                                タイトル
                                <span className="text-danger">&nbsp;*</span>
                            </label>
                            <input
                                type="text"
                                className="form-control"
                                id="lesson-title"
                                onChange={this.changeTitle.bind(this)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label
                                htmlFor="lesson-description"
                                className="app-text-color-dark-gray font-weight-bold"
                            >
                                説明
                            </label>
                            <textarea
                                className="form-control"
                                id="lesson-description"
                                rows="3"
                                value={this.state.description}
                                onChange={this.changeDescription.bind(this)}
                            />
                        </div>
                        <div
                            id="graphic-manager-screen"
                            className="form-group"
                            data-tip="選択した順で画像が使用できます"
                        >
                            <label
                                htmlFor="lesson-graphic"
                                className="app-text-color-dark-gray font-weight-bold"
                            >
                                メディア
                            </label>
                            <GraphicManager
                                changeGraphics={ids => {
                                    this.changeGraphics(ids)
                                }}
                                changeCreatingStatus={status => {
                                    this.setState({ isGraphicCreating: status })
                                }}
                                isCreating={this.state.isGraphicCreating}
                            />
                        </div>
                        <div id="avatar-manager-screen" className="form-group">
                            <label
                                htmlFor="lesson-avatar"
                                className="app-text-color-dark-gray font-weight-bold"
                            >
                                アバター
                                <span className="text-danger">&nbsp;*</span>
                            </label>
                            <AvatarManager
                                changeAvatar={id => {
                                    this.changeAvatar(id)
                                }}
                                changeCreatingStatus={status => {
                                    this.setState({ isAvatarCreating: status })
                                }}
                                isCreating={this.state.isAvatarCreating}
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-lg"
                            disabled={
                                !this.state.isFormCreatable ||
                                this.state.isCreating
                            }
                        >
                            作成
                        </button>
                    </form>

                    <ReactTooltip
                        className="tooltip"
                        place="top"
                        type="warning"
                    />
                </div>
                <style jsx>{`
                    #lesson-creator-screen {
                        width: 100%;
                        height: 100%;
                    }
                    #lesson-creator {
                        padding-top: 50px;
                        padding-bottom: 100px;
                    }
                    #lesson-form {
                        width: 80%;
                        max-width: 600px;
                        margin: auto;
                    }
                    button[type='submit'] {
                        margin-top: 30px;
                    }
                `}</style>
            </div>
        )
    }
}
