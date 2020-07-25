import React from 'react';
import { Navigate } from "react-router-dom";
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';

export class AuthorizationErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isUnauthenticated: false, error: null };
  }

  static getDerivedStateFromError(error) {
    if (error.name === "RelayNetwork" && error.source.errors.some(error => error.extensions?.code === "UNAUTHENTICATED")) {
      return {
        isUnauthenticated: true,
        error,
      };
    } else {
      return {
        isUnauthenticated: false,
        error
      }
    }
  }

  componentDidCatch(error, info) {
    // Customized error handling goes here!
  }

  errorToElement = (error, index) => {
    console.log(index)
    if (error.extensions?.code === "UNAUTHENTICATED") {
      return <Button onClick={() => {
        this.setState({error: null, isUnauthenticated: false})
        //       return <Navigate key={index} to="/login" state={{errorMessage: error.message, oldPathname: window.location.pathname }} />
      }}>fgfdg</Button>
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