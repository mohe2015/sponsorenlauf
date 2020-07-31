import React from 'react';
import './App.css';
import { Login } from './login/Login';
import { Home } from './Home';
import { MyAppBar } from './MyAppBar';
import { UsersList } from './users/UsersList'
import { RunnersList } from './runners/RunnersList'
import { RoundsList } from './rounds/RoundsList';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import { CreateUser } from './users/create/CreateUser';
import { CreateRunner } from './runners/create/CreateRunner';
import { CreateRound } from './rounds/create/CreateRound';
import { NotFound } from './NotFound';
import { ProtectedRoute } from './ProtectedRoute';

// authorizationerrorboundary
// which passes state update function down to login children
// login can then update the error state

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
          <Routes>
            <ProtectedRoute path="*" element={<MyAppBar />}>
              <Route path="/" element={<Home />} />
              <Route path="/users">
                <Route path="/create" element={<CreateUser />} />
                <Route path="*" element={<UsersList />} />
              </Route>
              <Route path="/runners">
                <Route path="/create" element={<CreateRunner />} />
                <Route path="*" element={<RunnersList />} />
              </Route>
              <Route path="/rounds">
                <Route path="/create" element={<CreateRound />} />
                <Route path="*" element={<RoundsList />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </ProtectedRoute>
            <Route path="/login" element={<Login />} />
          </Routes>
    </React.Fragment>
  );
}

export default App;
