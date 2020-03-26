import React from "react";
import { QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import environment from "../environment";
import Student from "./Student";

export default class StudentList extends React.Component {
  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query StudentListQuery {
            students {
              #edges {
              #node {
              startNumber
              ...Student_student
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
            <ul>
              {props.students.map(student => (
                <Student key={student.startNumber} student={student} />
              ))}
            </ul>
          );
        }}
      />
    );
  }
}
