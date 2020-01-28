import React from "react";
import Round from "./Round";
import Table from "react-bootstrap/Table";

export default class RoundList extends React.Component {
  render() {
    return (
      <Table bordered hover variant="sm" style={{ pageBreakInside: "avoid" }}>
        <thead>
          <tr>
            <th>Startnummer</th>
            <th>Name</th>
            <th>Zeit</th>
          </tr>
        </thead>
        <tbody>
          {this.props.viewer.map(roundEdge => (
            <Round key={roundEdge.node.id} round={roundEdge.node} />
          ))}
        </tbody>
      </Table>
    );
  }
}
