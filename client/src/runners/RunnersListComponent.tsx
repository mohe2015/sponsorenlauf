import React from "react";
import { usePaginationFragment, graphql } from "react-relay/hooks";
import { RunnerRow } from "./RunnerRow";
import { unstable_useTransition as useTransition } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { RunnersListComponent_runner$key } from "../__generated__/RunnersListComponent_runner.graphql";

export function RunnersListComponent({
  runners,
}: {
  runners: RunnersListComponent_runner$key;
}) {
  const [startTransition, isPending] = useTransition({ busyDelayMs: 1000, busyMinDurationMs: 1500  });

  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment RunnersListComponent_runner on Query
      @refetchable(queryName: "RunnersListPaginationQuery") {
        runners(first: $count, after: $cursor, orderBy: $orderBy)
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
    runners
  );

  return (
    <>
      {(data.runners?.edges ?? []).map((edge) => {
        const node = edge!.node;
        return <RunnerRow key={node.id} runner={node} />;
      })}
      {hasNext ? (
        <TableRow>
          <TableCell component="th" scope="row" colSpan={6}>
            <LoadingButton
              fullWidth={true}
              pending={isLoadingNext || isPending}
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
