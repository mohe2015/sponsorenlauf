import React from "react";
import { QueryRenderer } from "react-relay";
import graphql from "babel-plugin-relay/macro";
import environment from "../environment";
import Student from "./Student";
import { Table } from "react-bootstrap";

export default class StudentList extends React.Component {
  groupBy = function(xs, key) {
    return xs.reduce(function(rv, x) {
      (rv[x.node.class] = rv[x.node.class] || []).push(x.node);
      return rv;
    }, {});
  };

  values = dictionary => {
    return Object.keys(dictionary).map(function(key) {
      return dictionary[key];
    });
  };

  render() {
    return (
      <QueryRenderer
        environment={environment}
        query={graphql`
          query StudentListQuery {
            students(first: 2147483647) @connection(key: "Student_students") {
              edges {
                node {
                  id
                  class
                  ...Student_student
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
          let dict = this.groupBy(props.students.edges);
          return (
            <div>
              {Object.keys(dict).map(clazzName => (
                <Table
                  key={clazzName}
                  bordered
                  hover
                  variant="sm"
                  style={{ pageBreakInside: "avoid" }}
                >
                  <thead>
                    <tr>
                      <th>Startnummer ({clazzName})</th>
                      <th>Name</th>
                      <th>Jahrgang</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dict[clazzName].map(student => (
                      <Student key={student.id} student={student} />
                    ))}
                  </tbody>
                </Table>
              ))}
            </div>
          );
        }}
      />
    );
  }
}
