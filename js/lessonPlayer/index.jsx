import React from 'react';
import ReactDOM from 'react-dom';
import LessonLoader from './lessonLoader';
import LessonAvatar from './lessonAvatar';
import LessonPlayer from './lessonPlayer';

export default class LessonPlayerScreen extends React.Component {
    constructor(props) {
        super(props);
        this.container;
        this.playerElement;

        this.loader = new LessonLoader(props.match.params.id);
        this.state = {
            avatar:    new LessonAvatar(),
            lesson:    {},
            isLoading: true,
        }
    }

    async componentDidMount() {
        await this.loader.loadForPlay();

        const dom = await this.state.avatar.createDom(this.loader.avatarFileURL, this.container);
        dom.setAttribute('id', 'avatar-canvas');
        ReactDOM.findDOMNode(this.playerElement).append(dom);

        window.addEventListener('resize', (() => {
            this.state.avatar.updateSize(this.container);
        }));

        this.setState({ lesson: this.loader.lesson, isLoading: false });
    }

    render() {
        return (
            <div id="lesson-player" ref={(e) => { this.container = e; }}>
                <LessonPlayer avatar={this.state.avatar} lesson={this.state.lesson} isLoading={this.state.isLoading} ref={(e) => { this.playerElement = e; }} />
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