import React, { useMemo } from "react";
import { usePaginationFragment, useSubscription } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { UserRow } from './UserRow'
import { unstable_useTransition as useTransition } from 'react';
import LoadingButton from '@material-ui/lab/LoadingButton';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

export function UsersListComponent(props) {
  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const {data, hasNext, loadNext, isLoadingNext} = usePaginationFragment(
    graphql`
      fragment UsersListComponent_user on Query
      @refetchable(queryName: "UsersListPaginationQuery") {
        users(first: $count, after: $cursor)
        @connection(key: "UsersList_user_users") {
          edges {
            node {
              id
              ...UserRow_user
            }
          }
        }
      }
    `,
    props.users
  );
  const subscriptionConfig = useMemo(() => ({
    subscription: graphql`
    subscription UsersListComponentSubscription {
      subscribeUsers {
        id
        name
        role
      }
    }`,
    variables: {},
    onCompleted: () => {

    },
    onError: error => {

    },
    onNext: response => {

    },
    updater: store => {
      
    }
  }))
  useSubscription(subscriptionConfig);

  return (<>
      {(data.users?.edges ?? []).map(edge => {
        const node = edge.node;
        return (
          <UserRow key={node.id} user={node} />
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