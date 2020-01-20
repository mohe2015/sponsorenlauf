import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from './constants'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
  Redirect,
  useHistory,
  useLocation
} from "react-router-dom";
import { Paper } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

class Login extends Component {

  state = {
    email: '',
    password: '',
    name: ''
  }

  render() {
    return (
        <Grid container justify = "center">
          <Paper>

          <h4>Login</h4>

          <form>
            <div>
              <TextField
                value={this.state.name}
                onChange={(e) => this.setState({ name: e.target.value })}
                required id="username" label="Nutzername" type="text" autoComplete="current-username" />
            </div>
            <div>
              <TextField
                value={this.state.password}
                onChange={(e) => this.setState({ password: e.target.value })}
                required id="password" label="Passwort" type="password" autoComplete="current-password" />
            </div>
            <div>
              <Button onClick={() => this._confirm()} variant="contained" color="primary" component={RouterLink} to="/">
                Anmelden
              </Button>
            </div>
          </form>

        </Paper>
      </Grid>
    )
  }

  _confirm = async () => {
    // ... you'll implement this in a bit
  }

  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }

}

export default Login
