import React from "react";
import { usePaginationFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { RoundRow } from './../rounds/RoundRow'
import { unstable_useTransition as useTransition } from 'react';
import LoadingButton from '@material-ui/lab/LoadingButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export function UserRoundsListComponent(props) {
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const {data, hasNext, loadNext, isLoadingNext} = usePaginationFragment(
    graphql`
      fragment UserRoundsListComponent_round on Query
      @refetchable(queryName: "UserRoundsListPaginationQuery") {
        rounds(first: $count, after: $cursor, orderBy: { id: desc })
        @connection(key: "UserRoundsList_round_rounds") {
          edges {
            node {
              id
              ...RoundRow_round
            }
          }
        }
      }
    `,
    props.rounds
  );

  return (<>
      {(data.rounds?.edges ?? []).map(edge => {
        const node = edge.node;
        return (
          <RoundRow key={node.id} round={node} />
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