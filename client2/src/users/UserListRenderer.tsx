import React from "react";
import { QueryRenderer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import environment from "../Environment";
import { Redirect } from "react-router-dom";
import UserList from "./UserList";

type Props = {
};

type State = {
};

class UserListRenderer extends React.Component<Props, State> {

  renderQuery = ({error, props}: {error: Error | null, props: any}) => {
    if (error) {
      if (error.message === "Not Authorised!") {
        return <Redirect to="/login" />;
      } else {
        return <div>{error.message}</div>;
      }
    } else if (props) {
      return <UserList loading={false} list={props.users} />;
    }
    return <UserList loading={true} list={null} />;
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
