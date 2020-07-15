import { ConnectionHandler } from "relay-runtime";
import { requestSubscription } from "react-relay";
import React, { Component } from "react";
import environment from "./environment";
import graphql from "babel-plugin-relay/macro";
import { QueryRenderer } from "react-relay";
import RoundList from "./rounds/RoundList";

class RoundSubscriptionPage extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const subscription = graphql`
      subscription RoundSubscriptionPageSubscription {
        SubscribeRounds {
          id
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
      variables,
      updater: (store) => {
        const newRecord = store.getRootField("SubscribeRounds");
        console.log("newRecord", newRecord);
        const conn = ConnectionHandler.getConnection(
          store.getRoot(),
          "RoundSubscriptionPageQuery_rounds"
        );
        console.log("conn", conn);
        const edge = ConnectionHandler.createEdge(
          store,
          conn,
          newRecord,
          "newRoundEdge"
        );
        console.log("edge", edge);
        ConnectionHandler.insertEdgeBefore(conn, edge);
      },
      onError: (error) => console.log(`An error occured:`, error),
    });

    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query RoundSubscriptionPageQuery {
            rounds(first: 0, last: 100000000)
              @connection(key: "RoundSubscriptionPageQuery_rounds") {
              edges {
                node {
                  id
                  student {
                    startNumber
                    name
                  }
                  time
                }
              }
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
          return <RoundList viewer={props.rounds.edges} />;
        }}
      />
    );
  }
}

export default RoundSubscriptionPage;