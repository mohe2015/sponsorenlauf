import React from "react";
import { QueryRenderer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import environment from "../Environment";
import { Redirect } from "react-router-dom";
import RunnerList from "./RunnerList";

type Props = {
};

type State = {
};

class RunnerListRenderer extends React.Component<Props, State> {

  renderQuery = ({error, props}: {error: Error | null, props: any}) => {
    if (error) {
      if (error.message === "Not Authorised!") {
        return <Redirect to="/login" />;
      } else {
        return <div>{error.message}</div>;
      }
    } else if (props) {
      return <RunnerList loading={false} list={props.runners} />;
    }
    return <RunnerList loading={true} list={null} />;
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query RunnerListRendererQuery {
            runners(first: 100) {
              ...RunnerList_list
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

export default RunnerListRenderer;
