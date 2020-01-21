import React, { Component } from 'react';
import {
  BrowserRouter,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './Login'
import Navbar from 'react-bootstrap/Navbar'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Nav from 'react-bootstrap/Nav'
import { GC_USER_ID, GC_AUTH_TOKEN } from './constants'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem(GC_USER_ID),
    }
    this.logout = this.logout.bind(this);
  }

  handler = (val) => {
    this.setState({
      userId: val
    })
  }

  logout (e) {
    localStorage.removeItem(GC_USER_ID)
    localStorage.removeItem(GC_AUTH_TOKEN)
    this.setState({ userId: null })
  }

  render() {
    return (
      <BrowserRouter>
        <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#features">Features</Nav.Link>
              <Nav.Link href="#pricing">Pricing</Nav.Link>
              <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>
            <Nav>
              <Nav.Link href="#deets">More deets</Nav.Link>
              <Nav.Link eventKey={2} href="#memes">
                Dank memes
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <ul>
          <li>
            <Link to="/public">Public Page</Link>
          </li>
          <li>
            <Link to="/protected">Protected Page</Link>
          </li>
          <li>
          {this.state.userId ?
            <Link to='/' onClick={this.logout}>Logout</Link>
            :
            <Link to='/login'>Login</Link>}
            </li>
        </ul>

        <Switch>
          <Route exact path="/">
          </Route>
          <Route exact path='/login'>
            <Login handler={this.handler}></Login>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;