import React from 'react';
import ReactDOM from 'react-dom';
import LessonLoader from './lessonLoader';
import LessonAvatar from './lessonAvatar';
import LessonController from './lessonController';
import TweetButton from './tweetButton';

export default class LessonPlayer extends React.Component {
    constructor(props) {
        super(props);
        this.container;
        this.playerElement;

        this.loader = new LessonLoader(props.match.params.id);
        this.state = {
            avatar:       new LessonAvatar(),
            lesson:       {},
            packedlesson: {},
            isLoading:    true,
        }
    }

    async componentDidMount() {
        const result = await this.loader.loadForPlay();

        if (!result) {
            alert('授業がみつかりませんでした。URLが誤っているか、公開期間が終了しています。');
            location.href = '/';
        }

        const dom = await this.state.avatar.createDom(this.loader.avatarFileURL, this.container);
        dom.setAttribute('id', 'avatar-canvas');
        dom.style.zIndex = 10;
        dom.style.position = 'absolute';
        dom.style.top = 0;
        dom.style.bottom = 0;
        dom.style.left = 0;
        dom.style.right = 0;
        dom.style.margin = 'auto';
        ReactDOM.findDOMNode(this.playerElement).append(dom);

        window.addEventListener('resize', (() => {
            this.state.avatar.updateSize(this.container);
        }));

        this.setState({ lesson: this.loader.lesson, packedLesson: this.loader.packedLesson, isLoading: false });
    }

    render() {
        return (
            <div id="lesson-player" ref={(e) => { this.container = e; }}>
                <LessonController avatar={this.state.avatar} lesson={this.state.packedLesson} isLoading={this.state.isLoading} ref={(e) => { this.playerElement = e; }} />
                <TweetButton lesson={this.state.lesson} isLoading={this.state.isLoading} />
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