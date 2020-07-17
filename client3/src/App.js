import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Login } from './login/Login';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <Login />
    </React.Fragment>
  );
}

export default App;
