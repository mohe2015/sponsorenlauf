import React from "react";
import { QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import environment from "../environment";
import { Table } from "react-bootstrap";
import Round from "./Round";

// TODO use pagination as this list may get really long over time
// https://relay.dev/docs/en/pagination-container
export default class RoundList extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query RoundListQuery {
            rounds(first: 2147483647) @connection(key: "Round_rounds") {
              edges {
                node {
                  id
                  ...Round_round
                }
              }
            }
          }
        `}
        variables={{}}
        render={({ error, props }) => {
          if (error) {
            return <div>Error!</div>;
          }
          if (!props) {
            return <div>Loading...</div>;
          }
          return (
            <Table
              bordered
              hover
              variant="sm"
              style={{ pageBreakInside: "avoid" }}
            >
              <thead>
                <tr>
                  <th>Startnummer</th>
                  <th>Name</th>
                  <th>Zeit</th>
                </tr>
              </thead>
              <tbody>
                {props.rounds.edges.map(node => (
                  <Round key={node.id} round={node} />
                ))}
              </tbody>
            </Table>
          );
        }}
      />
    );
  }
}
