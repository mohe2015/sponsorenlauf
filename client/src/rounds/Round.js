import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class Round extends React.Component {
  render() {
    const {
      student: { startNumber, name },
      time
    } = this.props.round;

    return (
      <tr>
        <td>{startNumber}</td>
        <td>{name}</td>
        <td>{time}</td>
      </tr>
    );
  }
}

export default createFragmentContainer(Round, {
  round: graphql`
    fragment Round_round on Round {
      student {
        startNumber
        name
      }
      time
    }
  `
});
