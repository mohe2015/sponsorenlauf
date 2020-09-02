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
import LoadingButton from "@material-ui/lab/LoadingButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";

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

      // TODO FIXME prevent caching of that data
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
          variables: {}
        });
    },
    [
      id,
      startTransition,
      location,
    ]
  );

  return (
        <LoadingButton disableElevation pending={isPending} onClick={onSubmit}>
            <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPlus} />
            <Typography variant="button" noWrap>
                <Box component="span" ml={1}>
                Passwörter generieren
                </Box>
            </Typography>
        </LoadingButton>
  );
}
