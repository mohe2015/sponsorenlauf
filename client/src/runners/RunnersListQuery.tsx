import React from "react";
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { RunnersListComponent } from './RunnersListComponent';

export function RunnersListQuery(props) {
  const data = useLazyLoadQuery(
    graphql`
query RunnersListQuery($count: Int!, $cursor: String, $orderBy: RunnerOrderByInput!) {
  ...RunnersListComponent_runner
}
  `,
  {
    count: 25,
    orderBy: props.orderByInput
  },
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