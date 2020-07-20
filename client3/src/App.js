import React from 'react';
import './App.css';
import { Login } from './login/Login';
import { Home } from './Home';
import { MyAppBar } from './MyAppBar';
import { UsersList } from './users/UsersList'
import { RunnersList } from './runners/RunnersList'
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AuthorizationErrorBoundary } from './AuthorizationErrorBoundary';
import { CreateUser } from './users/create/CreateUser';
import { CreateRunner } from './runners/create/CreateRunner';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <AuthorizationErrorBoundary>
          <Routes>
            <Route path="*">
              <Route path="/" element={<><MyAppBar /><Suspense fallback={<CircularProgress />}><Home /></Suspense></>} />
              <Route path="/users">
                <Route path="/create" element={<><MyAppBar /><CreateUser /></>} />
                <Route path="*" element={<><MyAppBar /><UsersList /></>} />
              </Route>
              <Route path="/runners">
                <Route path="/create" element={<><MyAppBar /><CreateRunner /></>} />
                <Route path="*" element={<><MyAppBar /><RunnersList /></>} />
              </Route>
            </Route>
            <Route path="login" element={<Login />} />
          </Routes>
      </AuthorizationErrorBoundary>
    </React.Fragment>
  );
}

export default App;
