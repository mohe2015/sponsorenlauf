import React, { ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import { QueryRenderer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import environment from "./Environment";

type Props = {
};

type State = {
  
};

type MeQueryType = {
  me: {
    id: string,
    name: string,
    role: string
  }
}

class StartPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
    };
  }


  renderQuery = ({error, props}: {error: Error | null, props: unknown}) => {
    let properties = props as MeQueryType;
    console.log(props);
    console.log(error);
    if (error) {
      return <div>{error.message}</div>;
    } else if (props) {
      return <div>{properties.me.name} is great!</div>;
    }
    return <div>Loading</div>;
  }

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query StartPageMeQuery {
            me {
              id
              role
              name
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

export default StartPage;