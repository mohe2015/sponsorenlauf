import React from "react";
import { usePaginationFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { Suspense, unstable_SuspenseList as SuspenseList } from 'react';
import { RunnerRow } from './RunnerRow'

export function RunnersListComponent(props) {
  const {data} = usePaginationFragment(
    graphql`
      fragment RunnersListComponent_runner on Query
      @refetchable(queryName: "RunnersListPaginationQuery") {
        runners(first: $count, after: $cursor)
        @connection(key: "RunnersList_runner_runners") {
          edges {
            node {
              id
              ...RunnerRow_runner
            }
          }
        }
      }
    `,
    props.runners
  );

  return (
    <SuspenseList revealOrder="forwards">
      {(data.runners?.edges ?? []).map(edge => {
        const node = edge.node;
        return (
          <RunnerRow key={node.id} runner={node} />
        );
      })}
    </SuspenseList>
  );
}