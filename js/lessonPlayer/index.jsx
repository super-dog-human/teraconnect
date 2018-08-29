import React from 'react';
import ReactDOM from 'react-dom';
import LessonLoader from './lessonLoader';
import LessonAvatar from './lessonAvatar';
import LessonPlayer from './lessonPlayer';
import * as Const from '../common/constants';

export default class LessonPlayerScreen extends React.Component {
    constructor(props) {
        super(props)
        this.container;
        this.playerElement;

        this.avatar = new LessonAvatar();
        this.loader = new LessonLoader(props.match.params.id);
        this.state = {
            isLoading: true,
        };
    }

    componentDidMount() {
        if (this.props.isPreview) {
            this.loader.loadForPreview();
            // TODO
        } else {
            this.loader.loadForPlayAsync().then(() => {
                const size = containerSize();
                return this.avatar.createDom(this.loader.avatarFileURL, size.width, size.height);
            })
            .then((dom) => {
                dom.setAttribute('id', 'avatar-canvas');
                ReactDOM.findDOMNode(this.playerElement).append(dom);

                window.addEventListener('resize', (() => {
                    const size = containerSize();
                    this.avatar.updateSize(size.width, size.height);
                }));

                this.avatar.setDefaultAnimation();
                this.avatar.loadRecordedAnimation(this.loader.lesson.poseKey);
                this.setState({ isLoading: false });
            });

            const containerSize = (() => {
                let playerWidth, playerHeight;
                if (this.container.clientHeight / this.container.clientWidth > Const.RATIO_16_TO_9) {
                    playerWidth  = this.container.clientWidth;
                    playerHeight = Math.round(this.container.clientWidth * Const.RATIO_16_TO_9);
                } else {
                    playerWidth  = Math.round(this.container.clientHeight / Const.RATIO_16_TO_9);
                    playerHeight = this.container.clientHeight;
                }
                return { width: playerWidth, height: playerHeight };
            });
        }
    }

    render() {
        return (
            <div id="lesson-player" ref={(e) => { this.container = e; }}>
                <LessonPlayer avatar={this.avatar} loader={this.loader} isLoading={this.state.isLoading} ref={(e) => { this.playerElement = e; }} />
                <style jsx>{`
                    #lesson-player {
                        text-align: center;
                    }
                `}</style>
            </div>
        );
    }

    componentWillUnmount() {
        if (this.loader) this.loader.clearBeforeUnload();
        if (this.avatar) this.avatar.clearBeforeUnload();
    }
}

LessonPlayerScreen.defaultProps = {
    isPreview: false
};