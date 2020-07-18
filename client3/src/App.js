import React from 'react';
import './App.css';
import { Login } from './login/Login';
import { Home } from './Home';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AuthorizationErrorBoundary } from './AuthorizationErrorBoundary';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />

      <AuthorizationErrorBoundary>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="login" element={<Login />} />
          </Routes>
        </Suspense>
      </AuthorizationErrorBoundary>

    </React.Fragment>
  );
}

export default App;
