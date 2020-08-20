import React from "react";
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { UserRoundsListComponent } from './UserRoundsListComponent';

export function UserRoundsListQuery() {
  const data = useLazyLoadQuery(
    graphql`
query UserRoundsListQuery($count: Int!, $cursor: String) {
  ...UserRoundsListComponent_round
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
    <UserRoundsListComponent rounds={data} />
  )
}