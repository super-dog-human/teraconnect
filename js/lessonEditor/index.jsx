import React from 'react';
import Menu from '../menu';
import TextForms from './textForms';
import PlayerScreen from '../lessonPlayer';

export default class LessonEditor extends React.Component {
  constructor(props) {
    super(props)
  }

  //        /* <Player isPreview={true} /> -->
  render() {
    return(
      <div id="lesson-editor" className="row">
        <Menu /> { /* FIXME use HoCs */}
        <TextForms lessonID={this.props.match.params.id} className="col-lg-7" />
        <PlayerScreen className="col-lg-5" />
        <style jsx>{`
            #lesson-player-screen {
                width: 600px;
                margin-left: 50px;
                margin-right: 50px;
            }
        `}</style>
      </div>
    )
  }
}