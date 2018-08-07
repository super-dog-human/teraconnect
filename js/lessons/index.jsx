import React from 'react';
import Menu from '../menu';
import TextForms from './textForms';
import Player from './player';

export default class Lessons extends React.Component {
  constructor(props) {
    super(props)
  }

  render() {
    return(
      <div>
        <Menu /> { /* FIXME use HoCs */}
        <Player lessonID={this.props.match.params.id}/>
        <TextForms lessonID={this.props.match.params.id}/>
      </div>
    )
  }
}