import React from "react";
import { useFragment, graphql } from "react-relay/hooks";
import { UserRow } from "./UserRow";
import { UsersListPasswordsComponent_user$key } from "../__generated__/UsersListPasswordsComponent_user.graphql";

export function UsersListPasswordsComponent({
  users,
}: {
  users: UsersListPasswordsComponent_user$key;
}) {
  const data = useFragment(
    graphql`
      fragment UsersListPasswordsComponent_user on QueryUsers_Connection {
        edges {
          cursor
          node {
            id
            ...UserRow_user
          }
        }
      }
    `,
    users
  );

  return (
    <>
      {(data.edges ?? []).map((edge) => {
        const node = edge!.node;
        return <UserRow key={node.id} user={node} />;
      })}
    </>
  );
}
