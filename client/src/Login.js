import React, { Component } from 'react'
import { GC_USER_ID, GC_AUTH_TOKEN } from './constants'
import LoginMutation from './LoginMutation'
import {
  withRouter
} from 'react-router-dom'

class Login extends Component {

  state = {
    name: '',
    password: '',
  }

  render() {

    return (
      <form>
        <h4>Login</h4>
        <input
          value={this.state.name}
          onChange={(e) => this.setState({ name: e.target.value })}
          type='text'
          placeholder='Your name'
        />
        <input
          value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })}
          type='password'
          placeholder='Choose a safe password'
        />
        <div
          onClick={() => this._confirm()}
        >
          Login
        </div>
      </form>
    )
  }

  _confirm = () => {
    const { name, password } = this.state
    LoginMutation(name, password, (id, token) => {
      this._saveUserData(id, token)
      this.props.history.push(`/`) // TODO useHistory
    })
  }
  
  _saveUserData = (id, token) => {
    localStorage.setItem(GC_USER_ID, id)
    localStorage.setItem(GC_AUTH_TOKEN, token)
  }
}

export default withRouter(Login)