import React, { ChangeEvent } from "react";
import { QueryRenderer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import environment from "../Environment";
import { Navigate } from "react-router-dom";
import UserList from "./UserList";

type Props = {
};

type State = {
};

class UserListRenderer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  renderQuery = ({error, props}: {error: Error | null, props: any}) => {
    if (error) {
      if (error.message == "Not Authorised!") {
        return <Navigate to="/login"></Navigate>;
      } else {
        return <div>{error.message}</div>;
      }
    } else if (props) {
      return <UserList list={props.list} />;
    }
    return <div>Loading</div>;
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query UserListRendererQuery {
            users(first: 100) {
              ...UserList_list
            }
          }
        `}
        variables={{
        }}
        render={this.renderQuery}
      />
    );
  }
}

export default UserListRenderer;
