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

        this.avatar = new LessonAvatar();
        this.loader = new LessonLoader(props.match.params.id);
        this.state = {
            isLoading: true,
        };
    }

    async componentDidMount() {
        if (this.props.isPreview) {
            this.loader.loadForPreview();
            // TODO
        } else {
            await this.loader.loadForPlayAsync();
            const dom = await this.avatar.createDom(this.loader.avatarFileURL, this.container);
            dom.setAttribute('id', 'avatar-canvas');
            ReactDOM.findDOMNode(this.playerElement).append(dom);

            window.addEventListener('resize', (() => {
                this.avatar.updateSize(this.container);
            }));

            this.avatar.setDefaultAnimation();
            this.avatar.loadRecordedAnimation(this.loader.lesson.poseKey);
            this.setState({ isLoading: false });
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