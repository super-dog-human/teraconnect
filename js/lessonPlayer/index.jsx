import React from 'react';
import ReactDOM from 'react-dom';
import LessonLoader from './lessonLoader';
import LessonAvatar from './lessonAvatar';
import LessonPlayer from './lessonPlayer';

export default class LessonPlayerScreen extends React.Component {
    static RATIO_16_TO_9() { return 0.5625 };

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

        if (this.props.isPreview) {
            loader.loadForPreview();
            // TODO
        } else {
            loader.loadForPlayAsync().then(() => {
                const size = this.containerSize();
                return avatar.createDom(loader.avatarFileURL, size.width, size.height);
            })
            .then((dom) => {
                dom.setAttribute('id', 'avatar-canvas');
                dom.setAttribute('style', 'display: block; position: absolute; top: 0;');
                ReactDOM.findDOMNode(this.playerElement).append(dom);

                window.addEventListener('resize', (() => {
                    const size = this.containerSize();
                    avatar.updateSize(size.width, size.height);
                }));

                avatar.loadLesson(loader.lesson.poseKey);
                this.setState({ avatar: avatar, loader: loader });
            });
        }
    }

    containerSize() {
        const playerWidth = this.container.clientWidth;
        const playerHeight = Math.round(playerWidth * this.constructor.RATIO_16_TO_9());
        return { width: playerWidth, height: playerHeight };
    }

    render() {
        return (
            <div ref={(e) => { this.container = e; }}>
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