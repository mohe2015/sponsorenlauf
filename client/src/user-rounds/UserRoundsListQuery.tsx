import React from "react";
import { useLazyLoadQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import { UserRoundsListComponent } from "./UserRoundsListComponent";
import { UserRoundsListQueryListQuery } from "../__generated__/UserRoundsListQueryListQuery.graphql";

export function UserRoundsListQuery() {
  const data = useLazyLoadQuery<UserRoundsListQueryListQuery>(
    graphql`
      query UserRoundsListQueryListQuery($count: Int!, $cursor: String) {
        ...UserRoundsListComponent_round
      }
    `,
    { count: 25 },
    {
      fetchPolicy: "store-or-network",
      networkCacheConfig: {
        force: false,
      },
    }
  );

  return <UserRoundsListComponent rounds={data} />;
}
