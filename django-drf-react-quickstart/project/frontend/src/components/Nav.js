import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

class CustomNavbar extends React.Component {
  render() {
    return (
      <header>
        <Navbar expand="lg" className="mb-1">
          <Navbar.Brand href="http://127.0.0.1:8000/" className="mt-2">Your Future Best Worker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#" className="active">Home</Nav.Link>
              <Nav.Link href="http://127.0.0.1:8000/candidates/">Candidates</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
      </header>
    )
  }
}

export default CustomNavbar;


