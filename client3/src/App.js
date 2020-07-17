import React from 'react';
import './App.css';
import { Login } from './login/Login';
import { Home } from './Home';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes, Route } from 'react-router-dom';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="login" element={<Login />} />
      </Routes>

    </React.Fragment>
  );
}

export default App;
