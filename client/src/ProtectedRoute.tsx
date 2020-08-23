import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { RouteProps } from 'react-router'

export const ProtectedRoute = ({ children, ...rest }: { children: React.ReactNode} & RouteProps) => {
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