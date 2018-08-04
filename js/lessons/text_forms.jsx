import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Input, Nav, Navbar, NavItem } from 'reactstrap';
import FontAwesome from 'react-fontawesome'

const API_URL = "https://api.teraconnect.org/voice_text/";

export default class TextForm extends React.Component {
    constructor(props) {
      super(props);
      this.state = { voice_texts: [] };
      axios
        .get(API_URL + props.lessonID)
        .then((results) => {
          const voice_texts = results.data;
          if (voice_texts) {
            this.setState({ voice_texts: voice_texts });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }

    render() {
      return(
        <div id="lessons">
          <Navbar expand="md" className="app-color-beige">
            <Nav className="mx-auto">
                <NavItem>
                  <Link to='#'>レビュー</Link>
                </NavItem>
                <NavItem>
                  <Link to='#'>授業を作る</Link>
                </NavItem>
                <NavItem>
                  <Link to='#'>教材を作る</Link>
                </NavItem>
                <NavItem>
                  <Link to='#'>分析</Link>
                </NavItem>
            </Nav>
          </Navbar>

          <div id="lines">
            {
              this.state.voice_texts.map((t, i) => {
                if (t.isTexted && t.text) {
                  return <div className="line" key={i}><Input type="text" defaultValue={t.text} /></div>
                } else if (t.isTexted) {
                  return <div className="line" key={i}><Input type="text" placeholder="（検出なし）" /></div>
                } else {
                  return <div className="line text-detecting" key={i}><FontAwesome name="spinner" spin /></div>
                }
              })
            }
          </div>
        </div>
      )
    }
  }