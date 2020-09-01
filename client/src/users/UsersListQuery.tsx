import React from "react";
import { useLazyLoadQuery } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
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
