import React from 'react';
import { useNavigate } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { Login } from './login/Login';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null, id: 0 };
  }

  componentDidCatch(error, info) {
    this.setState((prevState) => { return {error, id: prevState.id + 1}});
  }

  errorToElement = (error, index) => {
    if (error.extensions?.code === "UNAUTHENTICATED") {
      return <Login key={index} updateErrorBoundary={(state) => { this.setState(state) }} />;
    } else if (error.extensions?.code === "FORBIDDEN") {
      return  <Alert key={index} variant="filled" severity="error">
                {error.message}
              </Alert>;
    } 
    return  <Alert key={index} variant="filled" severity="error"
              action={
                <Button color="inherit" size="small" onClick={this._retry}>
                  Erneut versuchen
                </Button>
              }
            >
              {error.message}
            </Alert>;
  }

  _relogin = () => {
    document.cookie = "logged-in=; sameSite=strict; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    this.setState((prevState) => { return {error: null, id: prevState.id + 1}});
  }

  _retry = () => {
    this.setState((prevState) => { return {error: null, id: prevState.id + 1}});
  }

  render() {
    if (this.state.error != null) {
      if (this.state.error.name === "RelayNetwork") {
        return (
          <React.Fragment>
            {this.state.error.source.errors.map(this.errorToElement)}
          </React.Fragment>
        )
      } else {
        return  <Alert variant="filled" severity="error"
                  action={
                    <Button color="inherit" size="small" onClick={this._retry}>
                      Erneut versuchen
                    </Button>
                  }
                >
                  Fehler {this.state.error.name}: {this.state.error.message}
                </Alert>;
      }
    }
    return <div key={this.state.id}>
            {this.props.children}
          </div>
  }
}

export function AuthorizationErrorBoundary(props) {
  const navigate = useNavigate()
  return <ErrorBoundary navigate={navigate} {...props} />
}