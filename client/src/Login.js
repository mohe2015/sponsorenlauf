import React, { Component } from "react";
import { GC_USER_ID, GC_AUTH_TOKEN } from "./environment";
import LoginMutation from "./LoginMutation";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      password: "",
      validated: false,
    };
  }

  handleSubmit = (event) => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this._confirm(event);
    }

    this.setState({ validated: true });
  };

  _confirm = (e) => {
    e.preventDefault();
    this.setState({ disabled: true });
    const { name, password } = this.state;
    LoginMutation(name, password, (id, token) => {
      this._saveUserData(id, token);
      this.setState({ disabled: false }); // TODO failure
      this.navigate = useNavigate();
      this.navigate("/");
    });
  };

  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id);
    localStorage.setItem(GC_AUTH_TOKEN, token);
    this.props.handler(id);
  };

  render() {
    return (
      <Container style={{ maxWidth: 540 + "px" }}>
        <Container className="bg-light">
          <h1>Login</h1>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={(e) => this.handleSubmit(e)}
          >
            <div className="pb-3">
              <Form.Label>Nutzername:</Form.Label>
              <Form.Control
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
                type="text"
                placeholder="Nutzername"
                autoComplete="username"
                required
              />
              <Form.Control.Feedback type="valid">
                Gültiger Nutzername!
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Bitte gebe einen Nutzernamen ein.
              </Form.Control.Feedback>
            </div>
            <div className="pb-3">
              <Form.Label>Passwort:</Form.Label>
              <Form.Control
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                type="password"
                placeholder="Passwort"
                autoComplete="current-password"
                required
              />
              <Form.Control.Feedback type="valid">
                Sieht gut aus!
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Bitte gebe ein Passwort ein.
              </Form.Control.Feedback>
            </div>
            <div className="pb-3">
              <Button
                variant="primary"
                type="submit"
                disabled={this.state.disabled}
              >
                Login
              </Button>
            </div>
          </Form>
        </Container>
      </Container>
    );
  }
}

export default Login;
