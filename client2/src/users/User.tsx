
import React from "react"
import { createFragmentContainer } from "react-relay"
import { graphql } from "babel-plugin-relay/macro";

function User(props: any) {
  const {id, name, role} = props.user;
  return (
    <div>{name}</div>
  );
}

export default createFragmentContainer(User, {
  user: graphql`
    fragment User_user on User {
      id
      name
      role
    }
  `,
});
                  