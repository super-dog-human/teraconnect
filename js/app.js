import axios from 'axios';
import React from 'react';
import { Route, Link } from 'react-router-dom';
import {
  Input, Nav, Navbar, NavItem
} from 'reactstrap';
import FontAwesome from 'react-fontawesome'

const API_URL = "https://api.teraconnect.org/voice_text/";

const App = () => (
  <div>
    <Header />
    <Main />
    <Footer />
  </div>
)

const Header = () => (
  <header class="app-color-light-green">
    <Navbar expand="md">
      <div class="pull-left font-weight-bold text-white">TeraConnect</div>
      <Nav className="mx-auto">
          <NavItem>
            <Link to='#'>ホーム</Link>
          </NavItem>
          <NavItem>
            <Link to='/lessons/bd6rthcgrv5g00i83ifg'>授業収録</Link>
          </NavItem>
      </Nav>
    </Navbar>
  </header>
)

const Footer = () => (
  <footer class="app-color-dark-navy">
    <div>ZYGOPTERA</div>
  </footer>
)

const Main = () => (
  <main>
    <Route exact path='/'      component={Home} />
    <Route exact path='/lessons/:id' component={Lessons} />
  </main>
)

const Home = () => (
  <div>
    <h2>Home</h2>
  </div>
)

class Lessons extends React.Component {
  constructor(props) {
    super(props)
    this.state = { voice_texts: [] };
    const lessonID = props.match.params.id;
    axios
      .get(API_URL + lessonID)
      .then((results) => {
        const voice_texts = results.data;
        if (voice_texts) { this.setState({ voice_texts: voice_texts }) };
      })
      .catch((err) => {
        console.log(err);
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
                this.state.voice_texts.map(t => {
                  if (t.isTexted && t.text) {
                    return <div class="line"><Input type="text" value={t.text} /></div>
                  } else if (t.isTexted) {
                    return <div class="line"><Input type="text" placeholder="（検出なし）" /></div>
                  } else {
                    console.log("foobar!");
                    return <div class="line text-detecting"><FontAwesome name="spinner" spin /></div>
                  }
                })
              }
        </div>
      </div>
    )
  }
}

export default App