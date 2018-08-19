import React from 'react';
import ReactDOM from 'react-dom';
import LessonLoader from './lessonLoader';
import LessonAvatar from './lessonAvatar';
import LessonPlayer from './lessonPlayer';

export default class LessonPlayerScreen extends React.Component {
    constructor(props) {
        super(props)
        this.container;
        this.playerElement;

        this.state = {
            avatar: null,
            loader: null,
        };
    }

    componentDidMount() {
        const loader = new LessonLoader(this.props.match.params.id);
        const avatar = new LessonAvatar();

        const multiplier = 0.5625; // 16:9
        const playerWidth = this.container.clientWidth;
        const playerHeight = Math.round(playerWidth * multiplier);

        if (this.props.isPreview) {
            loader.loadForPreview();
            // TODO
        } else {
            loader.loadForPlayAsync().then(() => {
                return avatar.createDom(loader.avatarFileURL, playerWidth, playerHeight);
            })
            .then((dom) => {
                ReactDOM.findDOMNode(this.playerElement).append(dom);
                avatar.loadLesson(loader.lesson.poseKey);
                this.setState({ avatar: avatar, loader: loader });
            });
        }
    }

    render() {
        return (
            <div id="lesson-player-screen" ref={(e) => { this.container = e; }}>
                <LessonPlayer avatar={this.state.avatar} loader={this.state.loader} ref={(e) => { this.playerElement = e; }} />
            </div>
        );
    }


    componentWillUnmount() {
        this.state.loader.clearBeforeUnload();
        this.state.avatar.clearBeforeUnload();
    }
}

LessonPlayerScreen.defaultProps = {
  isPreview: false
};