import React from 'react';
import Menu from '../menu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import ReactTooltip from 'react-tooltip'
import * as Const from '../common/constants';

export default class LessonCreator extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isCreating:  false,
            title:       '',
            description: '',
            avatarID:    '',
            graphicIDs:  [],
        };
    }

    _changeTitle(event) {
        this.setState({ title: event.target.value });
    }

    _changeDescription(event) {
        this.setState({ description: event.target.value });
    }

    async _create(event) {
        event.preventDefault();
        this.setState({ isCreating: true });

        const lesson = await this._createLesson().catch((err) => {
            console.error(err);
            return false;
        });

        if (!lesson) {
            // error modal
            return;
        }

        const result = await this._createLessonGraphic(lesson.id).catch((err) => {
            console.error(err);
            return false;
        });

        if (!result) {
            // error modal
            return;
        }

        this.props.history.push(`/lessons/${lesson.id}/record`);
    }

    async _createLesson() {
        const body = {
            title:       this.state.title,
            description: this.state.description,
            avatarID:    'bdiuotgrbj8g00l9t3ng', // FIXME
        };
        const url = Const.LESSON_API_URL.replace('{lessonID}', ''); // API URL has no id when creating new.
        const result = await axios.post(url, body).catch((err) => {
            throw new Error(err);
        });

        return result.data;
    }

    async _createLessonGraphic(id) {
        const body = {
            graphicIDs: ['bdpq07j7jj3000mn1a60', 'bdpq08r7jj3000mn1a6g', 'be7qiiqrlisg00l4kqvg'],   // FIXME
        };
        const url = Const.LESSON_GRAPHIC_API_URL.replace('{lessonID}', id); // API URL has no id when creating new.
        const result = await axios.post(url, body).catch((err) => {
            throw new Error(err);
        });

        return result.data;
    }

    render() {
        return(
            <div id="lesson-creator-screen">
                <Menu selectedIndex='2' />

                <div id="lesson-creator">

                    <div id="loading-indicator">
                        <FontAwesomeIcon icon="spinner" spin />
                    </div>

                    <form id="lesson-form" onSubmit={this._create.bind(this)}>
                        <div className="form-group" data-tip="授業のタイトルを入力します">
                            <label htmlFor="lesson-title">タイトル</label>
                            <input type="text" className="form-control" id="lesson-title" onChange={this._changeTitle.bind(this)} required />
                        </div>

                        <div className="form-group" data-tip="授業の概略や視聴に必要な学力レベルなどを入力します">
                            <label htmlFor="lesson-description">説明</label>
                            <textarea className="form-control" id="lesson-description" rows="3" value={this.state.description} onChange={this._changeDescription.bind(this)}></textarea>
                        </div>

                        <div className="form-group" data-tip="授業で使用する図表を選択します（デモ版では変更不可）">
                            <label htmlFor="lesson-graphic">図表</label>
                            <div id="graphic-selecter">
                                <div id="graphic-scroll-selector">
                                    <div className="checkable-thumbnail selected-element float-left">
                                        <img src="https://storage.googleapis.com/teraconn_thumbnail/graphic/bdpq07j7jj3000mn1a60.png" />
                                        <input type="checkbox" checked={true}/>
                                    </div>
                                    <div className="checkable-thumbnail selected-element float-left">
                                        <img src="https://storage.googleapis.com/teraconn_thumbnail/graphic/bdpq08r7jj3000mn1a6g.png" />
                                        <input type="checkbox" checked={true} />
                                    </div>
                                    <div className="checkable-thumbnail selected-element float-left">
                                        <img src="https://storage.googleapis.com/teraconn_thumbnail/graphic/be7qiiqrlisg00l4kqvg.jpg" />
                                        <input type="checkbox" checked={true} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-group" data-tip="3Dモデルをアップロードして、様々なアバターで授業ができます（デモ版では変更不可）">
                            <label htmlFor="lesson-avatar">アバター</label>
                                <div id="avatar-selecter">
                                    <div className="form-inline">
                                        <label className="checkable-thumbnail selected-element">
                                            <img src="https://storage.googleapis.com/teraconn_thumbnail/avatar/bdiuotgrbj8g00l9t3ng.png" />
                                            <input type="checkbox" checked={true} />
                                        </label>
                                        <label className="checkable-thumbnail">
                                            <img src="https://storage.googleapis.com/teraconn_thumbnail/avatar/be9mj02e0tg000iub7fg.png" />
                                            <input type="checkbox" checked={false} />
                                        </label>
                                    </div>
                                </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg" disabled={this.state.isCreating}>作成</button>

                        <ReactTooltip />
                    </form>
                </div>
                <style jsx>{`
                    #lesson-creator-screen {
                        width: 100%;
                        height: 100%;
                        background-color: #616163;
                    }
                    #lesson-creator {
                        padding-top: 50px;
                        padding-bottom: 100px;
                        background-color: #616163;
                    }
                    #loading-indicator {
                        position: absolute;
                        z-index: 100;
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
                    #lesson-form label {
                        color: white;
                    }
                    .selected-element {
                        border: solid 6px #ec9f05;
                    }
                    #graphic-selecter {
                        width: 600px;
                        height: 170px;
                        overflow-x: scroll;
                        overflow-y: hidden;
                    }
                    #graphic-scroll-selector {
                        width 120%;
                    }
                    #graphic-selecter img {
                        max-width: 200px;
                        max-height: 150px;
                    }
                    #avatar-selecter img {
                        max-width: 200px;
                        max-height: 150px;
                    }
                    .checkable-thumbnail  {
                        position: relative;
                        margin-right: 30px;
                        cursor: pointer;
                    }
                    .checkable-thumbnail input {
                        position: absolute;
                        top: 0;
                        right: 0;
                    }

                `}</style>
            </div>
        )
    }
}