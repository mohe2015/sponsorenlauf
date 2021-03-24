import React from "react";
import { useFragment, useMutation, graphql } from "react-relay/hooks";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import ControlledTooltip from "../ControlledTooltip";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Skeleton from "@material-ui/lab/Skeleton";
import { useConfirm } from "material-ui-confirm";
import { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { UserRoundRow_round$key } from "../__generated__/UserRoundRow_round.graphql";
import { ConnectionHandler } from "relay-runtime";
import { UserRoundRowDeleteRoundMutation } from "../__generated__/UserRoundRowDeleteRoundMutation.graphql";

export function LoadingRoundRow() {
  return (
    <TableRow>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell>
        <Skeleton variant="text" />
      </TableCell>
      <TableCell align="right">
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

export function UserRoundRow({ round }: { round: UserRoundRow_round$key }) {
  const data = useFragment(
    graphql`
      fragment UserRoundRow_round on Round {
        id
        student {
          id
          startNumber
          name
        }
        time
        createdBy {
          id
          name
        }
      }
    `,
    round
  );

  const confirm = useConfirm();
  const [deleteRound, isDeleteRoundPending] = useMutation<
    UserRoundRowDeleteRoundMutation
  >(graphql`
    mutation UserRoundRowDeleteRoundMutation($id: String!) {
      deleteOneRound(where: { id: $id }) {
        id
      }
    }
  `);

  const deleteRoundCallback = useCallback(
    (event) => {
      confirm({
        title:
          "Runde von " +
          data.student.startNumber +
          " (" +
          data.student.name +
          ") löschen?",
        description:
          "Möchtest du die Runde von " +
          data.student.startNumber +
          " (" +
          data.student.name +
          ") wirklich löschen? Dies kann nicht rückgängig gemacht werden!",
        confirmationText: "Löschen",
        cancellationText: "Abbrechen",
      })
        .then(() => {
          deleteRound({
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
                "UserRoundsList_round_rounds",
                {
                  orderBy: { id: "desc" },
                }
              );
              if (!connectionRecord) {
                console.log("connection not found");
                return;
              }

              const payload = store.getRootField("deleteOneRound");

              const id = payload.getValue("id");

              ConnectionHandler.deleteNode(connectionRecord, id);
            },
          });
        })
        .catch(() => {
          // do nothing
        });
    },
    [deleteRound, data, confirm]
  );

  return (
    <TableRow>
      <TableCell>{data.student.startNumber}</TableCell>
      <TableCell>{data.student.name}</TableCell>
      <TableCell>{data.time}</TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Löschen">
          <LoadingButton
            disableElevation
            pending={isDeleteRoundPending}
            onClick={deleteRoundCallback}
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
