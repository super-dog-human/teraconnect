import React from 'react';
import { Link } from 'react-router-dom';
import { Nav, Navbar, NavItem } from 'reactstrap';

const Header = () => (
  <header className="app-color-light-green fixed-top">
    <Navbar expand="md">
      <div className="pull-left font-weight-bold text-white">TeraConnect</div>
      <Nav className="mx-auto">
          <NavItem>
            <Link to='/'>ホーム</Link>
          </NavItem>
          <NavItem>
            <Link to='/lessons/bdfstlck6ru000hd78eg'>授業収録</Link>
          </NavItem>
      </Nav>
    </Navbar>
  </header>
)

export default Header