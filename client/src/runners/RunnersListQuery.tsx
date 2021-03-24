import React from "react";
import { useLazyLoadQuery, graphql } from "react-relay/hooks";
import { RunnersListComponent } from "./RunnersListComponent";
import { RunnersListQueryListQuery } from "../__generated__/RunnersListQueryListQuery.graphql";

export function RunnersListQuery({
  orderByInput,
}: {
  orderByInput: { [x: string]: "desc" | "asc" };
}) {
  const data = useLazyLoadQuery<RunnersListQueryListQuery>(
    graphql`
      query RunnersListQueryListQuery(
        $count: Int!
        $cursor: String
        $orderBy: RunnerOrderByInput!
      ) {
        ...RunnersListComponent_runner
      }
    `,
    {
      count: 25,
      orderBy: orderByInput,
    },
    {
      fetchPolicy: "store-or-network",
      networkCacheConfig: {
        force: false,
      },
    }
  );

  return <RunnersListComponent runners={data} />;
}
