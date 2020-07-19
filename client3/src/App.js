import React from 'react';
import './App.css';
import { Login } from './login/Login';
import { Home } from './Home';
import { MyAppBar } from './MyAppBar';
import { UsersList } from './users/UsersList'
import CssBaseline from '@material-ui/core/CssBaseline';
import { Routes, Route } from 'react-router-dom';
import { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import { AuthorizationErrorBoundary } from './AuthorizationErrorBoundary';
import { CreateUser } from './users/create/CreateUser';

function App() {
  return (
    <React.Fragment>
      <CssBaseline />
      <AuthorizationErrorBoundary>
        <Suspense fallback={<CircularProgress />}>
          <Routes>
            <Route path="*" element={<MyAppBar />}>
              <Route path="/" element={<Home />} />
              <Route path="/users">
                <Route path="/create" element={<CreateUser />} />
                <Route path="*" element={<UsersList />} />
              </Route>
            </Route>
            <Route path="login" element={<Login />} />
          </Routes>
        </Suspense>
      </AuthorizationErrorBoundary>
    </React.Fragment>
  );
}

export default App;
