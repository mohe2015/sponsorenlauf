import { ConnectionHandler } from "relay-runtime";
import { requestSubscription } from "react-relay";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Container from "react-bootstrap/Container";
import environment from "./environment";
import graphql from "babel-plugin-relay/macro";

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

    return <Container style={{ maxWidth: 540 + "px" }}></Container>;
  }
}

export default withRouter(RoundSubscriptionPage);
