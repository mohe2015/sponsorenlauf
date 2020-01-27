import { commitMutation } from "react-relay";
import environment from "./environment";
import graphql from "babel-plugin-relay/macro";

const mutation = graphql`
  mutation AddRoundMutation($startNumber: Int!) {
    createOneRound(startNumber: $startNumber) {
      id
      time
    }
  }
`;

export default (startNumber, callback) => {
  const variables = {
    startNumber
  };

  commitMutation(environment, {
    mutation,
    variables,
    onCompleted: response => {
      const id = response.createOneRound.id;
      const time = response.createOneRound.time;
      callback(id, time);
    },
    onError: err => console.error(err)
  });
};
