import React, { useMemo } from "react";
import { usePaginationFragment, useSubscription, graphql } from "react-relay/hooks";
import { UserRow } from "./UserRow";
import { unstable_useTransition as useTransition } from "react";
import LoadingButton from "@material-ui/lab/LoadingButton";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import { UsersListComponent_user$key } from "../__generated__/UsersListComponent_user.graphql";
import { ConnectionHandler, GraphQLSubscriptionConfig } from "relay-runtime";
import { UsersListComponentSubscription } from "../__generated__/UsersListComponentSubscription.graphql";

export function UsersListComponent({
  users,
}: {
  users: UsersListComponent_user$key;
}) {
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });  

  const { data, hasNext, loadNext, isLoadingNext } = usePaginationFragment(
    graphql`
      fragment UsersListComponent_user on Query
      @refetchable(queryName: "UsersListPaginationQuery") {
        users(first: $count, after: $cursor)
        @connection(key: "UsersList_user_users") {
          edges {
            cursor
            node {
              id
              ...UserRow_user
            }
          }
        }
      }
    `,
    users
  );
  const subscriptionConfig: GraphQLSubscriptionConfig<UsersListComponentSubscription> = useMemo(
    () => ({
      subscription: graphql`
        subscription UsersListComponentSubscription {
          subscribeUsers {
            edge {
              cursor
              node {
                id
                ...UserRow_user
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
          "UsersList_user_users"
        );
        if (!connectionRecord) {
          return;
        }
        const payload = store.getRootField("subscribeUsers");

        //const previousEdge = payload.getLinkedRecord('previous_edge');
        const serverEdge = payload.getLinkedRecord("edge");

        const newEdge = ConnectionHandler.buildConnectionEdge(
          store,
          connectionRecord,
          serverEdge
        );

        ConnectionHandler.insertEdgeAfter(
          connectionRecord,
          newEdge!
          // previousEdge
        );
      },
    }),
    []
  );
  useSubscription(subscriptionConfig);

  return (
    <>
      {(data.users?.edges ?? []).map((edge) => {
        const node = edge!.node;
        return <UserRow key={node.id} user={node} />;
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