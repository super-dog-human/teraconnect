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
            isLoading: true,
            avatar:    new LessonAvatar(),
            loader:    new LessonLoader(props.match.params.id),
        };
    }

    componentDidMount() {
        if (this.props.isPreview) {
            this.state.loader.loadForPreview();
            // TODO
        } else {
            this.state.loader.loadForPlayAsync().then(() => {
                const size = this.containerSize();
                return this.state.avatar.createDom(this.state.loader.avatarFileURL, size.width, size.height);
            })
            .then((dom) => {
                dom.setAttribute('id', 'avatar-canvas');
                dom.setAttribute('style', 'display: block; position: absolute; top: 0;');
                ReactDOM.findDOMNode(this.playerElement).append(dom);

                window.addEventListener('resize', (() => {
                    const size = this.containerSize();
                    this.state.avatar.updateSize(size.width, size.height);
                }));

                this.state.avatar.loadLesson(this.state.loader.lesson.poseKey);
                this.setState({ isLoading: false });
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
                <LessonPlayer avatar={this.state.avatar} loader={this.state.loader} isLoading={this.state.isLoading} ref={(e) => { this.playerElement = e; }} />
            </div>
        );
    }

    componentWillUnmount() {
        if (this.state.loader) this.state.loader.clearBeforeUnload();
        if (this.state.avatar) this.state.avatar.clearBeforeUnload();
    }
}

LessonPlayerScreen.defaultProps = {
    isPreview: false
};