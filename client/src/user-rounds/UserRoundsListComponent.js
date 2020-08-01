import React, { useMemo } from "react";
import { usePaginationFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { RoundRow } from './../rounds/RoundRow'
import { unstable_useTransition as useTransition } from 'react';
import LoadingButton from '@material-ui/lab/LoadingButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { ConnectionHandler } from 'react-relay';

export function UserRoundsListComponent(props) {
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const {data, hasPrevious, loadPrevious, isLoadingPrevious} = usePaginationFragment(
    graphql`
      fragment UserRoundsListComponent_round on Query
      @refetchable(queryName: "UserRoundsListPaginationQuery") {
        rounds(last: $count, before: $cursor)
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
      { hasPrevious ? <TableRow>
        <TableCell component="th" scope="row" colSpan={4}>
          <LoadingButton fullWidth={true} pending={isLoadingPrevious || isPending} variant="contained" color="primary" onClick={() => {
                startTransition(() => {
                  loadPrevious(25)
                });
              }}>
            Mehr anzeigen
          </LoadingButton>
        </TableCell>
      </TableRow> : null}
    </>
  );
}