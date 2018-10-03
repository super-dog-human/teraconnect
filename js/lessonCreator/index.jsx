import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import Cookies from 'js-cookie';
import { isMobile } from 'react-device-detect';
import ReactTooltip from 'react-tooltip'
import AvatarManager from './avatarManager';
import GraphicManager from './graphicManager';
import * as Const from '../common/constants';

export default class LessonCreator extends React.Component {
    constructor(props) {
        super(props);

        this.lessonID = '';

        this.state = {
            isFormCreatable:   false,
            isGraphicCreating: false,
            isAvatarCreating:  false,
            isCreating:        false,
            title:             '',
            description:       '',
            avatarID:          null,
            graphicIDs:        [],
        };
    }

    async _changeTitle(event) {
        await this.setState({ title: event.target.value });
        this._checkSelectedMaterial();
    }

    _changeDescription(event) {
        this.setState({ description: event.target.value });
    }

    async _changeAvatar(id) {
        await this.setState({ avatarID: id });
        this._checkSelectedMaterial();
    }

    _changeGraphics(graphicIDs) {
        this.setState({ graphicIDs: graphicIDs });
    }

    _checkSelectedMaterial() {
        if (this.state.title.length > 0 && this.state.avatarID != null) {
            this.setState({ isFormCreatable: true });
        } else {
            this.setState({ isFormCreatable: false });
        }
    }

    async _create(event) {
        event.preventDefault();
        this.setState({ isCreating: true });

        const lesson = await this._postLesson().catch((err) => {
            console.error(err);
            return false;
        });

        if (!lesson) {
            // error modal
            return;
        }

        this.lessonID = lesson.id;
        this._checkCreatingStatus();
    }

    _checkCreatingStatus() {
        const interval = setInterval(() => {
            if (!this.state.isGraphicCreating && !this.state.isAvatarCreating) {
                this.setState({ isCreating: false });
                clearInterval(interval);
            }
        }, 1000);
    }

    async _postLesson() {
        const body = {
            title:       this.state.title,
            description: this.state.description,
            avatarID:    this.state.avatarID,
            graphicIDs:  this.state.graphicIDs,
        };
        const url = Const.LESSON_API_URL.replace('{lessonID}', ''); // API URL has no id when creating new.
        const result = await axios.post(url, body).catch((err) => {
            throw new Error(err);
        });

        return result.data;
    }

    componentDidMount() {
        if (isMobile) {
            alert('モバイル環境では授業を作成できないよ…\n正式版の公開までもう少し待っててね！');
            location.href = '/';
        }
    }

    componentDidUpdate(_, prevState) {
        if (prevState.isCreating && !this.state.isCreating) {
            this.props.history.push(`/lessons/${this.lessonID}/record`);
        }
    }

    render() {
        const isAgreeToTerms = Cookies.get('agreeToTerms');
        if (isAgreeToTerms !== 'true') {
            location.href = '/';
            return;
        }

        return(
            <div id="lesson-creator-screen" className="">
                <div id="lesson-creator" className="app-back-color-soft-white">
                    <div id="loading-indicator">
                        <FontAwesomeIcon icon="spinner" spin />
                    </div>
                    <form id="lesson-form" onSubmit={this._create.bind(this)}>
                        <div className="form-group">
                            <label htmlFor="lesson-title" className="app-text-color-dark-gray font-weight-bold">タイトル<span className="text-danger">&nbsp;*</span></label>
                            <input type="text" className="form-control" id="lesson-title" onChange={this._changeTitle.bind(this)} required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lesson-description" className="app-text-color-dark-gray font-weight-bold">説明</label>
                            <textarea className="form-control" id="lesson-description" rows="3" value={this.state.description} onChange={this._changeDescription.bind(this)}></textarea>
                        </div>
                        <div id="graphic-manager-screen" className="form-group" data-tip="選択した順で画像が使用できます">
                            <label htmlFor="lesson-graphic" className="app-text-color-dark-gray font-weight-bold">メディア</label>
                            <GraphicManager
                                changeGraphics={((ids) => { this._changeGraphics(ids); })}
                                changeCreatingStatus={(status) => { this.setState({ isGraphicCreating: status }); }}
                                isCreating={this.state.isGraphicCreating}/>
                        </div>
                        <div id="avatar-manager-screen" className="form-group">
                            <label htmlFor="lesson-avatar" className="app-text-color-dark-gray font-weight-bold">アバター<span className="text-danger">&nbsp;*</span></label>
                            <AvatarManager
                                changeAvatar={((id) => { this._changeAvatar(id); })}
                                changeCreatingStatus={((status) => { this.setState({ isAvatarCreating: status }); })}
                                isCreating={this.state.isAvatarCreating} />
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={!this.state.isFormCreatable || this.state.isCreating}>作成</button>
                    </form>

                    <ReactTooltip className="tooltip" place="top" type="warning" />
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
                    #loading-indicator {
                        position: absolute;
                        z-index: 1100; // indicator
                        width: 10vw;
                        height: 10vw;
                        top: 0;
                        bottom: 0;
                        left: 0;
                        right: 0;
                        margin: auto;
                        display: ${this.state.isCreating ? 'display' : 'none'};
                        font-size: 10vw;
                        opacity: 0.5;
                    }
                    #lesson-form {
                        width: 80%;
                        max-width: 600px;
                        margin: auto;
                    }
                    button[type="submit"] {
                        margin-top: 30px;
                    }
                `}</style>
            </div>
        )
    }
}