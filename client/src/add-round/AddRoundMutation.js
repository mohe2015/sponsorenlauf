import { commitMutation } from "react-relay";
import environment from "../environment";
import graphql from "babel-plugin-relay/macro";

// TODO FIXME RANGE_ADD https://relay.dev/docs/en/mutations
const mutation = graphql`
  mutation AddRoundMutation($startNumber: Int!) {
    createOneRound(startNumber: $startNumber) {
      id
      time
    }
  }
`;

export default (startNumber, callback) => {
  commitMutation(environment, {
    mutation,
    variables: {
      startNumber
    },
    onCompleted: (response, errors) => {
      const id = response.createOneRound.id;
      const time = response.createOneRound.time;
      callback(id, time);
    },
    onError: err => console.error(err)
  });
};
