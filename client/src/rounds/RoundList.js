import React from "react";
import { QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import environment from "../environment";
import { Table } from "react-bootstrap";
import Round from "./Round";

export default class RoundList extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query RoundListQuery {
            rounds {
              #edges {
              #node {
              id
              ...Round_round
              #},
              #},
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
                {this.props.rounds.map(round => (
                  <Round key={round.id} round={round} />
                ))}
              </tbody>
            </Table>
          );
        }}
      />
    );
  }
}
