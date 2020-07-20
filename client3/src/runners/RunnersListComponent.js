import React from "react";
import { usePaginationFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { Suspense, unstable_SuspenseList as SuspenseList } from 'react';
import { RunnerRow } from './RunnerRow'
import { unstable_useTransition as useTransition } from 'react';
import LoadingButton from '@material-ui/lab/LoadingButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export function RunnersListComponent(props) {
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const {data, hasNext, loadNext, isLoadingNext} = usePaginationFragment(
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

  return (<>
    {(data.runners?.edges ?? []).map(edge => {
      const node = edge.node;
      return (
        <RunnerRow key={node.id} runner={node} />
      );
    })}
    { hasNext ? <TableRow>
      <TableCell component="th" scope="row" colSpan={4}>
          <LoadingButton fullWidth={true} pending={isLoadingNext || isPending} variant="contained" color="primary" onClick={() => {
                startTransition(() => {
                  loadNext(25)
                });
              }}>
            Mehr anzeigen
          </LoadingButton>
        </TableCell>
    </TableRow> : null}
  </>
  );
}