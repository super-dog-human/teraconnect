import React from 'react';
import Menu from '../menu';
import TextForms from './textForms';
//import Player from '../lessonPlayer/index';

export default class LessonEditor extends React.Component {
  constructor(props) {
    super(props)
  }

  //        /* <Player isPreview={true} /> -->
  render() {
    return(
      <div>
        <Menu /> { /* FIXME use HoCs */}
        <div>
          <TextForms lessonID={this.props.match.params.id} />
        </div>
      </div>
    )
  }
}