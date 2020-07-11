import { commitMutation } from "react-relay";
import environment from "./environment";
import graphql from "babel-plugin-relay/macro";

const mutation = graphql`
  mutation LoginMutation($name: String!, $password: String!) {
    login(name: $name, password: $password) {
      token
      user {
        id
      }
    }
  }
`;

export default (name, password, callback) => {
  const variables = {
    name,
    password,
  };

  commitMutation(environment, {
    mutation,
    variables,
    onCompleted: (response, errors) => {
      const id = response.login.user.id;
      const token = response.login.token;
      callback(errors, id, token);
    },
    onError: (err) => console.error(err),
  });
};
