import React from "react";
import { useFragment, useMutation } from "react-relay/hooks";
import { unstable_useTransition as useTransition } from "react";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ControlledTooltip from "../ControlledTooltip";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { useConfirm } from "material-ui-confirm";
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen } from "@fortawesome/free-solid-svg-icons/faPen";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { UserRow_user$key } from "../__generated__/UserRow_user.graphql";
import { ConnectionHandler } from "relay-runtime";
import { UserRowDeleteUserMutation } from "../__generated__/UserRowDeleteUserMutation.graphql";
import graphql from 'babel-plugin-relay/macro';

export function LoadingUserRow() {
  return (
    <TableRow>
      <TableCell component="th" scope="row">
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        -
      </TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Bearbeiten">
          <LoadingButton disableElevation disabled={true}>
            <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPen} />
            <Typography variant="button" noWrap>
              <Box
                ml={1}
                component="span"
                display={{ xs: "none", md: "block" }}
              >
                Bearbeiten
              </Box>
            </Typography>
          </LoadingButton>
        </ControlledTooltip>

        <ControlledTooltip title="Löschen">
          <LoadingButton disableElevation disabled={true}>
            <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTrash} />
            <Typography variant="button" noWrap>
              <Box
                ml={1}
                component="span"
                display={{ xs: "none", md: "block" }}
              >
                Löschen
              </Box>
            </Typography>
          </LoadingButton>
        </ControlledTooltip>
      </TableCell>
    </TableRow>
  );
}

export function UserRow({ user }: { user: UserRow_user$key }) {
  const [startTransition, isPending] = useTransition({ busyDelayMs: 1000, busyMinDurationMs: 1500  });

  const data = useFragment(
    graphql`
      fragment UserRow_user on User {
        id
        name
        password
        role
      }
    `,
    user
  );
  const confirm = useConfirm();
  const [deleteUser, isDeleteUserPending] = useMutation<
    UserRowDeleteUserMutation
  >(graphql`
    mutation UserRowDeleteUserMutation($id: ID!) {
      deleteOneUser(where: { id: $id }) {
        id
      }
    }
  `);

  const deleteUserCallback = useCallback(
    (event) => {
      confirm({
        title: "Nutzer " + data.name + " löschen?",
        description:
          "Möchtest du den Nutzer " +
          data.name +
          " wirklich löschen? Dies kann nicht rückgängig gemacht werden!",
        confirmationText: "Löschen",
        cancellationText: "Abbrechen",
      })
        .then(() => {
          deleteUser({
            onCompleted: (response, errors) => {
              if (errors !== null) {
                console.log(errors);
                alert("Fehler: " + errors.map((e) => e.message).join(", "));
              }
            },
            onError: (error) => {
              alert(error); // TODO FIXME
            },
            variables: {
              id: data.id,
            },
            updater: (store) => {
              const connectionRecord = ConnectionHandler.getConnection(
                store.getRoot(),
                "UsersList_user_users"
              );
              if (!connectionRecord) {
                console.log("connection not found");
                return;
              }

              const payload = store.getRootField("deleteOneUser");

              const id = payload.getValue("id");

              ConnectionHandler.deleteNode(connectionRecord, id);
            },
          });
        })
        .catch(() => {
          // do nothing
        });
    },
    [deleteUser, data, confirm]
  );

  const navigate = useNavigate();

  const updateUserCallback = useCallback(
    (event) => {
      startTransition(() => {
        navigate("/users/edit/" + data.id, {
          state: {
            data,
          },
        });
      });
    },
    [data, navigate, startTransition]
  );

  return (
    <TableRow>
      <TableCell component="th" scope="row">
        {data.name}
      </TableCell>
      <TableCell>{data.role}</TableCell>
      <TableCell>
        {data.password}
      </TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Bearbeiten">
          <LoadingButton
            disableElevation
            pending={isPending}
            onClick={updateUserCallback}
          >
            <FontAwesomeIcon style={{ fontSize: 24 }} icon={faPen} />
            <Typography variant="button" noWrap>
              <Box
                ml={1}
                component="span"
                display={{ xs: "none", md: "block" }}
              >
                Bearbeiten
              </Box>
            </Typography>
          </LoadingButton>
        </ControlledTooltip>

        <ControlledTooltip title="Löschen">
          <LoadingButton
            disableElevation
            pending={isDeleteUserPending}
            onClick={deleteUserCallback}
          >
            <FontAwesomeIcon style={{ fontSize: 24 }} icon={faTrash} />
            <Typography variant="button" noWrap>
              <Box
                ml={1}
                component="span"
                display={{ xs: "none", md: "block" }}
              >
                Löschen
              </Box>
            </Typography>
          </LoadingButton>
        </ControlledTooltip>
      </TableCell>
    </TableRow>
  );
}
