import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import AddRoundMutation from "./AddRoundMutation";
import { QueryRenderer } from "react-relay";
import environment from "../environment";
import graphql from "babel-plugin-relay/macro";
import RoundList from "../rounds/RoundList";

class AddRound extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
      validated: false,
      startNumber: ""
    };
  }

  handleSubmit = event => {
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      this._confirm(event);
    }

    this.setState({ validated: true });
  };

  _confirm = e => {
    e.preventDefault();
    this.setState({ disabled: true });
    const { startNumber } = this.state;
    AddRoundMutation(Number(startNumber), (id, token) => {
      //this._saveUserData(id, token)
      this.setState({ disabled: false, startNumber: "" }); // TODO failure
    });
  };

  render() {
    return (
      <Container style={{ maxWidth: 540 + "px" }}>
        <Container className="bg-light">
          <h1 className="text-center">Runde hinzufügen</h1>
          <Form
            noValidate
            validated={this.state.validated}
            onSubmit={e => this.handleSubmit(e)}
          >
            <div className="pb-3">
              <Form.Control
                value={this.state.startNumber}
                onChange={e => this.setState({ startNumber: e.target.value })}
                type="number"
                placeholder="Startnummer"
                required
                className="form-control-lg"
              />
              <Form.Control.Feedback type="valid">
                Gültige Startnummer!
              </Form.Control.Feedback>
              <Form.Control.Feedback type="invalid">
                Bitte gebe eine gültige Startnummer ein.
              </Form.Control.Feedback>
            </div>
            <QueryRenderer
              environment={environment}
              query={graphql`
                query AddRoundStudentQuery($startNumber: Int!) {
                  student(where: { startNumber: $startNumber }) {
                    name
                    class
                  }
                }
              `}
              variables={{ startNumber: Number(this.state.startNumber) }}
              render={({ error, props }) => {
                if (error) {
                  return <div className="pb-3">{error.message}</div>;
                }
                if (!props) {
                  return <div className="pb-3">Loading...</div>;
                }
                return (
                  <div className="pb-3">
                    {props.student ? props.student.name : "-"}
                  </div>
                );
              }}
            />

            <div className="pb-3">
              <Button
                variant="primary"
                type="submit"
                disabled={this.state.disabled}
              >
                Runde hinzufügen
              </Button>
            </div>
          </Form>
        </Container>
        <QueryRenderer
          environment={environment}
          query={graphql`
            query AddRoundSubscriptionPageQuery {
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
      </Container>
    );
  }
}

export default withRouter(AddRound);
