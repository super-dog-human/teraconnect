import axios from 'axios';
import React, { Component } from 'react'
import { BrowserRouter, Route, Link } from 'react-router-dom'
import {
  Collapse,
  Form, FormGroup, Input,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem } from 'reactstrap';

const API_URL = "http://api.teraconnect.org/voice_text/";

const App = () => (
  <BrowserRouter>
    <div>
      <Route exact path='/' component={Home} />
      <Route path='/lessons/:id' component={Lessons} />
    </div>
  </BrowserRouter>
)

const Home = () => (
  <div>
    <h2>Home</h2>
    <ul>
      <li><Link to='/'>Home</Link></li>
      <li><Link to='/lessons/bd6rthcgrv5g00i83ifg'>Lessons</Link></li>
    </ul>
  </div>
)

const NavBar = () => (
  <div>
    <Navbar color="light" light expand="md">
      <NavbarBrand href="/">reactstrap</NavbarBrand>
      <NavbarToggler onClick={this.toggle} />
      <Collapse isOpen={this.state.isOpen} navbar>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink href="/components/">Components</NavLink>
          </NavItem>
          <NavItem>
            <NavLink href="https://github.com/reactstrap/reactstrap">GitHub</NavLink>
          </NavItem>
          <UncontrolledDropdown nav inNavbar>
            <DropdownToggle nav caret>
              Options
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem>
                Option 1
              </DropdownItem>
              <DropdownItem>
                Option 2
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem>
                Reset
              </DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
      </Collapse>
    </Navbar>
  </div>
)

class Lessons extends React.Component {
  constructor(props) {
    super(props)
    const lessonID = props.match.params.id;
    axios
      .get(API_URL + lessonID)
      .then((results) => {
        const data = results.data;
        const result = data.results[0];
        this.setState({
          voice_texts: result
        });
      },
      )
      .catch((err) => {
        console.log(err);
      });
  }
  render() {
    return(
      <div>
        <h2>授業編集</h2>
        <Form>
          <FormGroup>
            {this.state.voice_texts.map(t => {
              return <Input type="text" placeholder={t.text} />
            })}
          </FormGroup>
        </Form>
      </div>
    )
  }
}

export default App