import React from 'react';
import ReactDOM from 'react-dom';
import lessonLoader from './lessonLoader'

export default class Player extends React.Component {
    constructor(props) {
      super(props);
      this.state = { player: null　};
    }

    componentDidMount() {
      lessonLoader(this.props.lessonID).then((dom) => {
        const reactfindDomNode = ReactDOM.findDOMNode(this);
        reactfindDomNode.append(dom);
      });
    }

    render() {
      return (
        <div />
      );
    }
  }