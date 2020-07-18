import React from "react";
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { UsersListComponent } from './UsersListComponent';

export function UsersListQuery() {
  const data = useLazyLoadQuery(
    graphql`
query UsersListQuery($count: Int, $cursor: String) {
  ...UsersListComponent_user
}
  `,
  {count: 10},
  {fetchPolicy: "store-or-network"})

  return <UsersListComponent users={data} />
}