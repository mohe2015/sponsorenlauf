import React, { useMemo } from "react";
import { usePaginationFragment, useSubscription } from "react-relay/hooks";
import { RoundRow } from "./RoundRow";
import { unstable_useTransition as useTransition } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { RoundsListComponent_round$key } from "../__generated__/RoundsListComponent_round.graphql";
import { RoundsListComponentSubscription } from "../__generated__/RoundsListComponentSubscription.graphql";
import graphql from 'babel-plugin-relay/macro';

export function RoundsListComponent({
  rounds,
}: {
  rounds: RoundsListComponent_round$key;
}) {
  const [startTransition, isPending] = useTransition({ busyDelayMs: 1000, busyMinDurationMs: 1500  });

  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment RoundsListComponent_round on Query
      @refetchable(queryName: "RoundsListPaginationQuery") {
        rounds(first: $count, after: $cursor, orderBy: { id: desc })
        @connection(key: "RoundsList_round_rounds") {
          edges {
            node {
              id
              ...RoundRow_round
            }
          }
        }
      }
    `,
    rounds
  );
  const subscriptionConfig: GraphQLSubscriptionConfig<RoundsListComponentSubscription> = useMemo(
    () => ({
      subscription: graphql`
        subscription RoundsListComponentSubscription {
          subscribeRounds {
            edge {
              cursor
              node {
                id
                ...RoundRow_round
              }
            }
          }
        }
      `,
      variables: {},
      onCompleted: () => {
        console.log("onCompleted");
      },
      onError: (error) => {
        console.log("onError", error);
      },
      onNext: (response) => {
        console.log("onNext", response);
      },
      updater: (store) => {
        const connectionRecord = ConnectionHandler.getConnection(
          store.getRoot(),
          "RoundsList_round_rounds",
          {
            orderBy: { id: "desc" },
          }
        );
        if (!connectionRecord) {
          return;
        }
        const payload = store.getRootField("subscribeRounds");

        //const previousEdge = payload.getLinkedRecord('previous_edge');
        const serverEdge = payload.getLinkedRecord("edge");

        //const existingEdges = connectionRecord.getLinkedRecords("edges").map(e => e.getLinkedRecord("node").getValue("id"));
        //if (existingEdges.includes(serverEdge.getLinkedRecord("node").getValue("id"))) {
        //  console.log("node already in connection")
        //  return;
        //}

        const newEdge = ConnectionHandler.buildConnectionEdge(
          store,
          connectionRecord,
          serverEdge
        )!;

        ConnectionHandler.insertEdgeBefore(
          connectionRecord,
          newEdge
          //previousEdge
        );
      },
    }),
    []
  );
  useSubscription<RoundsListComponentSubscription>(subscriptionConfig);

  return (
    <>
      {(data.rounds.edges ?? []).map((edge) => {
        const node = edge.node;
        return <RoundRow key={node.id} round={node} />;
      })}
      {hasNext ? (
        <TableRow>
          <TableCell component="th" scope="row" colSpan={4}>
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
