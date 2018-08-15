import React from 'react';
import ReactDOM from 'react-dom';
import LessonLoader from './lessonLoader';
import lessonAvatar from './lessonAvatar';
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
      if (this.props.isPreview) {
        loader.loadForPreview();
        //.then((avatarFileURL) => {
        //  const dom = lessonAvatar(avatarFileURL);
        //  ReactDOM.findDOMNode(this).append(dom);
        //})
      } else {
        loader.loadForPlayAsync().then(() => {
          const dom = lessonAvatar(loader.avatarFileURL);
          // add motion to avatar
          ReactDOM.findDOMNode(this).append(dom);
        });
      }
    }

    componentWillUnmount() {
      // scene remove in avatar
      // window.URL.revokeObjectURL();
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