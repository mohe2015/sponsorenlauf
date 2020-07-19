import React from "react";
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { UsersListComponent } from './UsersListComponent';
import { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export function UsersListQuery() {
  const data = useLazyLoadQuery(
    graphql`
query UsersListQuery($count: Int, $cursor: String) {
  ...UsersListComponent_user
}
  `,
  {count: 100},
  {
    fetchPolicy: "store-or-network",
    networkCacheConfig: {
      force: false
    }
  })

  return (
    <UsersListComponent users={data} />
  )
}