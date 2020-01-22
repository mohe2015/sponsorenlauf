import React, { Component } from 'react'

class Student extends Component {

  render() {
    return (
      <tr>
        <td>{this.props.student.startNumber}</td>
        <td>{this.props.student.name}</td>
        <td>{this.props.student.grade}</td>
      </tr>
    )
  }
}

export default Student
