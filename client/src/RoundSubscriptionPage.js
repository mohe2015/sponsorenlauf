import { ConnectionHandler } from "relay-runtime";
import { requestSubscription } from "react-relay";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Container from "react-bootstrap/Container";
import environment from "./environment";
import graphql from "babel-plugin-relay/macro";
import { QueryRenderer } from "react-relay";
import RoundList from "./RoundList";

class RoundSubscriptionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const subscription = graphql`
      subscription RoundSubscriptionPageSubscription {
        SubscribeRounds {
          student {
            startNumber
            name
          }
          time
        }
      }
    `;

    const variables = {};

    requestSubscription(environment, {
      subscription,
      variables
    });

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query RoundSubscriptionPageQuery {
            rounds {
              student {
                startNumber
                name
              }
              time
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>{error.message}</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return <RoundList viewer={props.rounds} />;
        }}
      />
    );
  }
}

export default withRouter(RoundSubscriptionPage);
