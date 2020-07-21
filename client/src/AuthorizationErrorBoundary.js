import React from 'react';
import { Navigate } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

export class AuthorizationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return {
      error,
    };
  }

  componentDidCatch(error, info) {
    // Customized error handling goes here!
  }

  errorToElement = (error) => {
    if (error.extensions?.code === "UNAUTHENTICATED") {
      this.setState({error: null});
      return <Navigate to="/login" state={{errorMessage: error.message, oldPathname: window.location.pathname }} />
    } else if (error.extensions?.code === "FORBIDDEN") {
      return  <Alert variant="filled" severity="error">
                {error.message}
              </Alert>;
    } else {
      return  <Alert variant="filled" severity="error"
                action={
                  <Button color="inherit" size="small" onClick={this._retry}>
                    Erneut versuchen
                  </Button>
                }
              >
                {error.message}
              </Alert>;
    }
  }

  _retry = () => {
    this.setState({error: null});
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
        console.log(this.state.error.name);
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
    return this.props.children;
  }
}