import React from "react";
import { createFragmentContainer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import User from "./User";

type Props = {
  list: any;
};

type State = {
};

class UserList extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <ul>
        {this.props.list.map((user: any) => <User user={user} />)}
      </ul>
    );
  }
}

export default createFragmentContainer(UserList, {
  list: graphql`
    fragment UserList_list on UserConnection {
      pageInfo {
        hasNextPage
      }
      edges {
        node {
          ...User_user
        }
      }
    }
  `,
});