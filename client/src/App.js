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
import Me from './Me';
import Dropdown from 'react-bootstrap/Dropdown';

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
        <Navbar
        collapseOnSelect
        expand="md"
        bg="dark"
        variant="dark"
        >
          <Navbar.Brand className="order-sm-1" href="#home">Sponsorenlauf</Navbar.Brand>
          
 
          
          <Navbar.Toggle className="order-sm-3" aria-controls="responsive-navbar-nav" />
        
        

          <Navbar.Collapse className="order-sm-4" id="responsive-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="/students">Schüler</Nav.Link>
            </Nav>
            <Nav>
              
            </Nav>
          </Navbar.Collapse>


          <Dropdown className="order-sm-2" alignRight>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <svg class="bi bi-person" width="2em" height="2em" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" d="M15 16s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002zM5.022 15h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C13.516 12.68 12.289 12 10 12c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002zM10 9a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z" clip-rule="evenodd"/>
                  </svg>   
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
                  <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>

        </Navbar>
        
        {this.state.userId ?
          <Link to='/' onClick={this.logout}>Logout</Link>
          :
          <Link to='/login'>Login</Link>}

        <Switch>
          <Route exact path="/">
          </Route>
          <Route exact path='/login'>
            <Login handler={this.handler}></Login>
          </Route>
          <Route exact path='/account'>
            <Me></Me>
          </Route>
        </Switch>
      </BrowserRouter>
    );
  }
}

export default App;