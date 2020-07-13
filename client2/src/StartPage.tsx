import React, { ChangeEvent } from "react";
import { QueryRenderer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import environment from "./Environment";
import { Redirect } from "react-router-dom";
import MyAppBar from "./MyAppBar";

type Props = {
};

type State = {
};

class StartPage extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);
  }

  renderQuery = ({error, props}: {error: Error | null, props: any}) => {
    console.log(props);
    console.log(error);
    if (error) {
      if (error.message == "Not Authorised!") {
        return <Redirect to="/login" />;
      } else {
        return <div>{error.message}</div>;
      }
    } else if (props) {
      // sponsorenlauf
      // user / login / logout
      // schüler
      // runden
      // runde hinzufügen
      return <MyAppBar me={props.me}></MyAppBar>
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
