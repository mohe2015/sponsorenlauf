import React, { Suspense } from "react";
import { useLazyLoadQuery } from "react-relay/hooks";
import { RunnersListComponent } from "./RunnersListComponent";
import { RunnersListQueryListQuery } from "../__generated__/RunnersListQueryListQuery.graphql";
import graphql from "babel-plugin-relay/macro";

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

  return (
    <Suspense fallback={"test"}>
      <RunnersListComponent runners={data} />
    </Suspense>
  );
}
