import React from "react";
import { useMutation } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import {
  useCallback,
  unstable_useTransition as useTransition,
} from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { LocationStateType } from "../utils";
import { Location } from "history";
import { ConnectionHandler } from "relay-runtime";
import { GenerateUserPasswordsMutation } from "../__generated__/GenerateUserPasswordsMutation.graphql";

export function GenerateUserPasswords() {
  const navigate = useNavigate();
  const location = useLocation() as Location<LocationStateType | null>;
  let { id } = useParams();

  const [generatePasswords, isGeneratePasswordsPending] = useMutation<
    GenerateUserPasswordsMutation
  >(graphql`
mutation GenerateUserPasswordsMutation {
	generatePasswords {
		id
        name
        password
        role
	}
}
  `);

  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

        generatePasswords({
          onCompleted: (response, errors) => {
            if (errors !== null) {
              console.log(errors);
              alert("Fehler: " + errors.map((e) => e.message).join(", "));
            } else {
                startTransition(() => {
                    if (location.state?.oldPathname) {
                        navigate(location.state?.oldPathname);
                    } else {
                        navigate("/users");
                    }
                });
            }
          },
          onError: (error) => {
            console.log(error);
            alert(error); // TODO FIXME
          },
          variables: {},
          updater: (store) => {
            const connectionRecord = ConnectionHandler.getConnection(
              store.getRoot(),
              "UsersList_user_users"
            );
            if (!connectionRecord) {
              console.log("connection not found");
              return;
            }
            const payload = store.getRootField("generatePasswords");

            if (payload.getValue("__typename") === "UserMutationOutput") {
              const serverEdge = payload.getLinkedRecord("edge");

              const newEdge = ConnectionHandler.buildConnectionEdge(
                store,
                connectionRecord,
                serverEdge
              );

              ConnectionHandler.insertEdgeAfter(
                connectionRecord,
                newEdge!
              );
            }
          },
        });
    },
    [
      id,
      startTransition,
      location,
    ]
  );

  return (
    <></>
  );
}
