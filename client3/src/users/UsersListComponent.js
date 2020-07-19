import React from "react";
import { usePaginationFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";
import { Suspense, unstable_SuspenseList as SuspenseList } from 'react';
import { UserRow } from './UserRow'

export function UsersListComponent(props) {
  const {data} = usePaginationFragment(
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

  return (
    


      <SuspenseList revealOrder="forwards">
        {/* Extract each friend from the resulting data */}
        {(data.users?.edges ?? []).map(edge => {
          const node = edge.node;
          return (
            <UserRow key={node.id} user={node} />
          );
        })}
      </SuspenseList>
    
  );
}