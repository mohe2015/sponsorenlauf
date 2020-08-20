import React, { ReactNode } from 'react';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import { Login } from './login/Login';

export type AuthorizationErrorBoundaryState = {
  error: Error|null,
  id: number,
}

export class AuthorizationErrorBoundary extends React.Component<{children: ReactNode}, AuthorizationErrorBoundaryState> {

  constructor(props: { children: React.ReactNode }) {
    super(props);
    console.log("ErrorBoundary()")
    this.state = { error: null, id: 0 };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.log("componentDidCatch")

    this.setState((prevState) => { return {error, id: prevState.id + 1}});
  }

  errorToElement = (error: { extensions: { code: string; }; message: {} | null | undefined; }, index: number) => {
    console.log("errorToElement")

    if (error.extensions?.code === "UNAUTHENTICATED") {
      return <Login key={index} updateErrorBoundary={(stateFunction: ((previousState: AuthorizationErrorBoundaryState) => AuthorizationErrorBoundaryState)) => { this.setState(stateFunction) }} />;
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
    console.log("_relogin")

    document.cookie = "logged-in=; sameSite=strict; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    this.setState((prevState) => { return {error: null, id: prevState.id + 1}});
  }

  _retry = () => {
    console.log("_retry")

    this.setState((prevState) => { return {error: null, id: prevState.id + 1}});
  }

  render() {
    console.log("render", this.state)

    if (this.state.error != null) {
      if (this.state.error.name === "RelayNetwork") {
        return (
          <React.Fragment>
            {
              // @ts-expect-error
            this.state.error.source.errors.map(this.errorToElement)}
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