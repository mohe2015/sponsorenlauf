import { usePaginationFragment } from "react-relay/hooks";
import { RunnerRow } from "./RunnerRow";
import { useTransition } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import { RunnersListComponent_runner$key } from "../__generated__/RunnersListComponent_runner.graphql";
import graphql from "babel-plugin-relay/macro";

export function RunnersListComponent({
  runners,
}: {
  runners: RunnersListComponent_runner$key;
}) {
  const [isPending, startTransition] = useTransition();

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
