import React, { Component } from "react";

export default class Round extends Component {
  render() {
    return (
      <tr>
        <td>{this.props.round.student.startNumber}</td>
        <td>{this.props.round.student.name}</td>
        <td>{this.props.round.time}</td>
      </tr>
    );
  }
}
