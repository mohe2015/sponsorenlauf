import React from "react";
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { RunnersListComponent } from './RunnersListComponent';
import { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

export function RunnersListQuery() {
  const data = useLazyLoadQuery(
    graphql`
query RunnersListQuery($count: Int!, $cursor: String) {
  ...RunnersListComponent_runner
}
  `,
  {count: 1},
  {
    fetchPolicy: "store-or-network",
    networkCacheConfig: {
      force: false
    }
  })

  return (
    <RunnersListComponent runners={data} />
  )
}