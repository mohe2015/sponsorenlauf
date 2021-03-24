import React from "react";
import { useLazyLoadQuery, graphql } from "react-relay/hooks";
import { UsersListComponent } from "./UsersListComponent";
import { UsersListQueryListQuery } from "../__generated__/UsersListQueryListQuery.graphql";

export function UsersListQuery() {
  const data = useLazyLoadQuery<UsersListQueryListQuery>(
    graphql`
      query UsersListQueryListQuery($count: Int!, $cursor: String) {
        ...UsersListComponent_user
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

  return <UsersListComponent users={data} />;
}
