import React from "react";
import { createFragmentContainer } from "react-relay";
import graphql from "babel-plugin-relay/macro";

class Student extends React.Component {
  render() {
    const { startNumber, name, grade } = this.props.student;

    return (
      <tr>
        <td>{startNumber}</td>
        <td>{name}</td>
        <td>{grade}</td>
      </tr>
    );
  }
}

export default createFragmentContainer(Student, {
  student: graphql`
    fragment Student_student on Student {
      startNumber
      name
      grade
    }
  `
});
