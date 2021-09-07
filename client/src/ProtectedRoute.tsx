import React, { Suspense } from "react";
import { Route, Navigate } from "react-router-dom";
import { RouteProps } from "react-router";
import { LoadingRoundRow } from "./rounds/RoundRow";

export const ProtectedRoute = ({
  children,
  ...rest
}: { children: React.ReactNode } & RouteProps) => {
  if (document.cookie.split("; ").some((row) => row.startsWith("logged-in="))) {
    console.log("cookie there");
    return <Suspense fallback={"Loading..."}><Route {...rest}>{children}</Route></Suspense>;
  } else {
    console.log("cookie absent");
    return <Navigate to={{ pathname: "/login" }} />;
  }
};
