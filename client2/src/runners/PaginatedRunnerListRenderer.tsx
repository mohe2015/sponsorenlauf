import React from "react";
import { QueryRenderer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import environment from "../Environment";
import { Redirect } from "react-router-dom";
import RunnerList from "./RunnerList";
import PaginatedRunnerList from "./PaginatedRunnerList";

type Props = {
};

type State = {
};

class PaginatedRunnerListRenderer extends React.Component<Props, State> {

  renderQuery = ({error, props}: {error: Error | null, props: any}) => {
    if (error) {
      if (error.message === "Not Authorised!") {
        return <Redirect to="/login" />;
      } else {
        return <div>{error.message}</div>;
      }
    } else if (props) {
      console.log("renderQuery: ", props)
      return <PaginatedRunnerList loading={false} list={props} />;
    }
    return <div>loading</div>; // TESTING
    //return <PaginatedRunnerList loading={true} list={null} />;
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query PaginatedRunnerListRendererQuery {
            ...PaginatedRunnerList_list
          }
        `}
        variables={{
        }}
        render={this.renderQuery}
      />
    );
  }
}

export default PaginatedRunnerListRenderer;
