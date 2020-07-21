import React from "react";
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { RunnersListComponent } from './RunnersListComponent';

export function RunnersListQuery() {
  const data = useLazyLoadQuery(
    graphql`
query RunnersListQuery($count: Int!, $cursor: String) {
  ...RunnersListComponent_runner
}
  `,
  {count: 25},
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