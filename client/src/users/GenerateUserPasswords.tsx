import React from "react";
import { useMutation } from "react-relay/hooks";
import { useCallback } from "react";
import { GenerateUserPasswordsMutation } from "../__generated__/GenerateUserPasswordsMutation.graphql";
import LoadingButton from "@mui/lab/LoadingButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { UsersListPasswordsComponent_user$key } from "../__generated__/UsersListPasswordsComponent_user.graphql";
import graphql from "babel-plugin-relay/macro";

export function GenerateUserPasswords({
  setGeneratedPasswordsData,
}: {
  setGeneratedPasswordsData: React.Dispatch<
    React.SetStateAction<UsersListPasswordsComponent_user$key | null>
  >;
}) {
  const [generatePasswords, isGeneratePasswordsPending] =
    useMutation<GenerateUserPasswordsMutation>(graphql`
      mutation GenerateUserPasswordsMutation {
        generatePasswords {
          ...UsersListPasswordsComponent_user
        }
      }
    `);

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
            setGeneratedPasswordsData(response.generatePasswords);
          }
        },
        onError: (error) => {
          console.log(error);
          alert(error); // TODO FIXME
        },
        variables: {},
      });
    },
    [generatePasswords, setGeneratedPasswordsData]
  );

  return (
    <LoadingButton
      disableElevation
      loading={isGeneratePasswordsPending}
      onClick={onSubmit}
    >
      <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPlus} />
      <Typography variant="button" noWrap>
        <Box component="span" ml={1}>
          Passwörter generieren
        </Box>
      </Typography>
    </LoadingButton>
  );
}
