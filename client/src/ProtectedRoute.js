import React, {Element} from 'react';
import { Switch, Route, Navigate } from 'react-router-dom';

export const ProtectedRoute = ({ children, ...rest }) => {
    // TODO FIXME this only works when a rerender happens on navigation
    if (document.cookie.split('; ').some(row => row.startsWith('logged-in='))) {
        console.log("cookie there")
        return <Route {...rest}>
            {children}
        </Route>
    } else {
        console.log("cookie absent")
        return <Navigate to={{pathname: "/login"}}/>
    }
}