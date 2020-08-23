import React from "react";
import { useLazyLoadQuery } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { RoundsListComponent } from './RoundsListComponent';
import { RoundsListQueryListQuery } from "../__generated__/RoundsListQueryListQuery.graphql";

export function RoundsListQuery() {
  const data = useLazyLoadQuery<RoundsListQueryListQuery>(
    graphql`
query RoundsListQueryListQuery($count: Int!, $cursor: String) {
  ...RoundsListComponent_round
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
    <RoundsListComponent rounds={data} />
  )
}