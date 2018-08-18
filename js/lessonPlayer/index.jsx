import React from 'react';
import ReactDOM from 'react-dom';
import LessonLoader from './lessonLoader';
import LessonAvatar from './lessonAvatar';
import PlayerController from './playerController';

export default class LessonPlayer extends React.Component {
    constructor(props) {
        super(props);

        window.onblur = ((e) => {
        // TODO stop avatar motion.
        });

        window.onfocus = ((e) => {
        // TODO resume avatar motion.
        });
  }

    componentDidMount() {
        const loader = new LessonLoader(this.props.match.params.id);
        const avatar = new LessonAvatar();
        if (this.props.isPreview) {
            loader.loadForPreview();
            // TODO
        } else {
            loader.loadForPlayAsync().then(() => {
                return avatar.createDom(loader.avatarFileURL);
            })
            .then((dom) => {
                ReactDOM.findDOMNode(this).append(dom);
                avatar.loadLesson(loader.lesson, loader.material);

                avatar.play(true);
            });
        }
    }

    componentWillUnmount() {
        // scene remove in avatar
        // window.URL.revokeObjectURL();
        // clear redux
    }

    render() {
        return (
        <div id="player">
            <PlayerController />
        </div>
        );
    }
}

LessonPlayer.defaultProps = {
  isPreview: false
};