import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'reactstrap';

export default class Menu extends React.Component {
  render() {
    return(
      <div id="menu">
        <Navbar expand="md" className="app-color-beige">
          <Nav className="mx-auto">
              <NavItem>
                { /* use redux value for render underline */ }
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
      </div>
    )
  }
}