import React from "react";
import { usePaginationFragment } from "react-relay/hooks";
import { UserRoundRow } from "./UserRoundRow";
import { useTransition } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { UserRoundsListComponent_round$key } from "../__generated__/UserRoundsListComponent_round.graphql";
import graphql from 'babel-plugin-relay/macro';

export function UserRoundsListComponent({
  rounds,
}: {
  rounds: UserRoundsListComponent_round$key;
}) {
  const [isPending, startTransition, ] = useTransition();

  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment UserRoundsListComponent_round on Query
      @refetchable(queryName: "UserRoundsListPaginationQuery") {
        rounds(first: $count, after: $cursor, orderBy: { id: desc })
        @connection(key: "UserRoundsList_round_rounds") {
          edges {
            node {
              id
              ...UserRoundRow_round
            }
          }
        }
      }
    `,
    rounds
  );

  return (
    <>
      {(data.rounds?.edges ?? []).map((edge) => {
        const node = edge!.node;
        return <UserRoundRow key={node.id} round={node} />;
      })}
      {hasNext ? (
        <TableRow>
          <TableCell component="th" scope="row" colSpan={4}>
            <LoadingButton
              fullWidth={true}
              loading={isLoadingNext || isPending}
              variant="contained"
              color="primary"
              onClick={() => {
                startTransition(() => {
                  loadNext(25);
                });
              }}
            >
              Mehr anzeigen
            </LoadingButton>
          </TableCell>
        </TableRow>
      ) : null}
    </>
  );
}
