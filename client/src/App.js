import React, { Component } from "react";
import { BrowserRouter, Routes } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import "./App.css";
import Login from "./Login";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import { GC_USER_ID, GC_AUTH_TOKEN } from "./environment";
import Me from "./Me";
import Dropdown from "react-bootstrap/Dropdown";
import { Container } from "react-bootstrap";
import AddRound from "./add-round/AddRound";
import RoundSubscriptionPage from "./RoundSubscriptionPage";
import StudentList from "./students/StudentList";
import RoundList from "./rounds/RoundList";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: localStorage.getItem(GC_USER_ID),
    };
    this.logout = this.logout.bind(this);
  }

  handler = (val) => {
    this.setState({
      userId: val,
    });
  };

  logout(e) {
    localStorage.removeItem(GC_USER_ID);
    localStorage.removeItem(GC_AUTH_TOKEN);
    this.setState({ userId: null });
  }

  render() {
    return (
      <BrowserRouter>
        <Navbar
          collapseOnSelect
          expand="md"
          bg="dark"
          variant="dark"
          className="dont-print"
        >
          <Container fluid>
            <Navbar.Brand className="order-md-1" href="/">
              Sponsorenlauf
            </Navbar.Brand>

            {this.state.userId && (
              <Dropdown className="order-md-4" alignRight>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                  <svg
                    className="bi bi-person"
                    width="2em"
                    height="2em"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15 16s1 0 1-1-1-4-6-4-6 3-6 4 1 1 1 1h10zm-9.995-.944v-.002zM5.022 15h9.956a.274.274 0 00.014-.002l.008-.002c-.001-.246-.154-.986-.832-1.664C13.516 12.68 12.289 12 10 12c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664a1.05 1.05 0 00.022.004zm9.974.056v-.002zM10 9a2 2 0 100-4 2 2 0 000 4zm3-2a3 3 0 11-6 0 3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Header>
                    <Me />
                  </Dropdown.Header>
                  <Dropdown.Item href="/" onClick={this.logout}>
                    Abmelden
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            )}

            <Navbar.Toggle
              className="order-md-2"
              aria-controls="responsive-navbar-nav"
            />

            <Navbar.Collapse className="order-md-3" id="responsive-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Item>
                  <Nav.Link href="/students">Schüler</Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link href="/rounds">Runden</Nav.Link>
                </Nav.Item>

                <Nav.Item>
                  <Nav.Link href="/add_round">Runde hinzufügen</Nav.Link>
                </Nav.Item>
              </Nav>
              <Nav>
                {!this.state.userId && (
                  <Nav.Link href="/login">Anmelden</Nav.Link>
                )}
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Routes>
          <Route exact path="/"></Route>
          <Route exact path="/login">
            <Login handler={this.handler}></Login>
          </Route>
          <Route exact path="/students">
            <Container fluid>
              <h1 className="text-center dont-print">Schüler</h1>
              <StudentList />
            </Container>
          </Route>
          <Route exact path="/rounds">
            <Container fluid>
              <RoundList />
            </Container>
          </Route>
          <Route exact path="/add_round">
            <AddRound />
          </Route>
          <Route exact path="/round_subscription">
            <RoundSubscriptionPage />
          </Route>
        </Routes>
      </BrowserRouter>
    );
  }
}

export default App;
