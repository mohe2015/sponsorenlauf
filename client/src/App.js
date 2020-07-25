import React from 'react';
import './App.css';
import { Login } from './login/Login';
import { Home } from './Home';
import { MyAppBar } from './MyAppBar';
import { UsersList } from './users/UsersList'
import { RunnersList } from './runners/RunnersList'
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import { CreateUser } from './users/create/CreateUser';
import { CreateRunner } from './runners/create/CreateRunner';
import { NotFound } from './NotFound';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
          <Routes>
            <Route path="*" element={<MyAppBar />}>
              <Route path="/" element={<Home />} />
              <Route path="/users">
                <Route path="/create" element={<CreateUser />} />
                <Route path="*" element={<UsersList />} />
              </Route>
              <Route path="/runners">
                <Route path="/create" element={<CreateRunner />} />
                <Route path="*" element={<RunnersList />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Route>
            <Route path="login" element={<Login />} />
          </Routes>
    </React.Fragment>
  );
}

export default App;
