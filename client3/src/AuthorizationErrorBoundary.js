import React from 'react';
import { Navigate } from "react-router-dom";

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

  errorToElement = (error) => {
    if (error.extensions?.code === "UNAUTHENTICATED") {
      this.setState({error: null});
      return <Navigate to="/login" state={{errorMessage: error.message, oldPathname: window.location.pathname }} />
    } else if (error.extensions?.code === "FORBIDDEN") {
      return <div>{error.message}</div>
    } else {
      return <div>{error.message}</div>
    }
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
        return (
          <div>
            <div>Fehler {this.state.error.name}: {this.state.error.message}</div>
            <div>
              <pre>{JSON.stringify(this.state.error.source, null, 2)}</pre>
            </div>
          </div>
        );
      }
    }
    return this.props.children;
  }
}