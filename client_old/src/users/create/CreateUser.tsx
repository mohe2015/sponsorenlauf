import React, { useContext } from "react";
import { useMutation } from "react-relay/hooks";
import graphql from "babel-plugin-relay/macro";
import {
  useState,
  useCallback,
  unstable_useTransition as useTransition,
} from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import LoadingButton from "@material-ui/lab/LoadingButton";
import Alert from "@material-ui/lab/Alert";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import FormHelperText from "@material-ui/core/FormHelperText";
import { useLazyLoadQuery } from "react-relay/hooks";
import { LoadingContext } from "../../LoadingContext";
import { CreateUserFindUserQuery } from "../../__generated__/CreateUserFindUserQuery.graphql";
import { CreateUserUpdateMutation } from "../../__generated__/CreateUserUpdateMutation.graphql";
import { LocationStateType } from "../../utils";
import { Location } from "history";
import { UserRole } from "../../__generated__/UserRow_user.graphql";
import { CreateUserCreateMutation } from "../../__generated__/CreateUserCreateMutation.graphql";
import { ConnectionHandler } from "relay-runtime";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export function CreateUserContainer() {
  const loading = useContext(LoadingContext);

  if (loading) {
    return <div>Wird geladen...</div>;
  } else {
    return <CreateUser />;
  }
}

export function CreateUser() {
  const classes = useStyles();
  const navigate = useNavigate();
  const location = useLocation() as Location<LocationStateType | null>;
  let { id } = useParams();

  const data = useLazyLoadQuery<CreateUserFindUserQuery>(
    graphql`
      query CreateUserFindUserQuery($id: String) {
        user(where: { id: $id }) {
          id
          name
          role
        }
      }
    `,
    { id },
    {
      fetchPolicy: "store-or-network",
      networkCacheConfig: {
        force: false,
      },
      // @ts-expect-error
      skip: id === null,
    }
  );

  const [user_create, isCreateOneUserPending] = useMutation<
    CreateUserCreateMutation
  >(graphql`
    mutation CreateUserCreateMutation($username: String!, $role: UserRole!) {
      createOneUser(data: { name: $username, role: $role }) {
        __typename
        ... on UserMutationOutput {
          edge {
            cursor
            node {
              id
              name
              role
            }
          }
        }
        ... on UserMutationError {
          usernameError
          roleError
        }
      }
    }
  `);

  const [updateUser, isUpdateUserPending] = useMutation<
    CreateUserUpdateMutation
  >(graphql`
    mutation CreateUserUpdateMutation(
      $id: String
      $username: String!
      $role: UserRole!
    ) {
      updateOneUser(
        where: { id: $id }
        data: { name: { set: $username }, role: $role }
      ) {
        __typename
        ... on UserMutationOutput {
          edge {
            cursor
            node {
              id
              name
              role
            }
          }
        }
        ... on UserMutationError {
          usernameError
          roleError
        }
      }
    }
  `);

  const [username, setUsername] = useState(id ? data.user?.name : "");
  const [role, setRole] = useState(id ? data.user?.role : "");

  const [usernameError, setUsernameError] = useState<string | null>(null);
  const [roleError, setRoleError] = useState<string | null>(null);

  const [startTransition, isPending] = useTransition({ timeoutMs: 3000 });

  const onSubmit = useCallback(
    (event) => {
      event.preventDefault();

      if (id) {
        updateUser({
          onCompleted: (response, errors) => {
            if (errors !== null) {
              console.log(errors);
              alert("Fehler: " + errors.map((e) => e.message).join(", "));
            } else {
              if (response.updateOneUser.__typename === "UserMutationError") {
                setUsernameError(response.updateOneUser.usernameError);
                setRoleError(response.updateOneUser.roleError);
              } else {
                setUsernameError(null);
                setRoleError(null);

                startTransition(() => {
                  if (location.state?.oldPathname) {
                    navigate(location.state?.oldPathname);
                  } else {
                    navigate("/users");
                  }
                });
              }
            }
          },
          onError: (error) => {
            console.log(error);
            alert(error); // TODO FIXME
          },
          variables: {
            id,
            username: username!,
            role: role as UserRole,
          },
        });
      } else {
        user_create({
          onCompleted: (response, errors) => {
            if (errors !== null) {
              console.log(errors);
              alert("Fehler: " + errors.map((e) => e.message).join(", "));
            } else {
              if (response.createOneUser.__typename === "UserMutationError") {
                setUsernameError(response.createOneUser.usernameError);
                setRoleError(response.createOneUser.roleError);
              } else {
                setUsernameError(null);
                setRoleError(null);

                startTransition(() => {
                  if (location.state?.oldPathname) {
                    navigate(location.state?.oldPathname);
                  } else {
                    navigate("/users");
                  }
                });
              }
            }
          },
          onError: (error) => {
            console.log(error);
            alert(error); // TODO FIXME
          },
          variables: {
            username: username!,
            role: role as UserRole,
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
            const payload = store.getRootField("createOneUser");

            if (payload.getValue("__typename") === "UserMutationOutput") {
              //const previousEdge = payload.getLinkedRecord('previous_edge');
              const serverEdge = payload.getLinkedRecord("edge");

              const newEdge = ConnectionHandler.buildConnectionEdge(
                store,
                connectionRecord,
                serverEdge
              );

              ConnectionHandler.insertEdgeAfter(
                connectionRecord,
                newEdge!
                //previousEdge!
              );
            }
          },
        });
      }
    },
    [
      updateUser,
      id,
      username,
      role,
      user_create,
      navigate,
      startTransition,
      location,
    ]
  );

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <FontAwesomeIcon icon={faPlus} />
        </Avatar>
        <Typography component="h1" variant="h5">
          Nutzer {id ? "bearbeiten" : "hinzufügen"}
        </Typography>

        <form className={classes.form} noValidate onSubmit={onSubmit}>
          {location.state?.errorMessage && (
            <Alert variant="filled" severity="error">
              {location.state?.errorMessage}
            </Alert>
          )}

          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="username"
            label="Nutzername"
            name="username"
            autoComplete="off"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            helperText={usernameError}
            error={usernameError !== null}
          />
          <FormControl variant="outlined" fullWidth error={roleError !== null}>
            <InputLabel id="demo-simple-select-label">Rolle</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={role}
              onChange={
                // @ts-expect-error
                (e) => setRole(e.target.value)
              }
            >
              <MenuItem value={"ADMIN"}>Admin</MenuItem>
              <MenuItem value={"TEACHER"}>Rundenzähler</MenuItem>
              <MenuItem value={"VIEWER"}>Anzeiger</MenuItem>
            </Select>
            <FormHelperText>{roleError}</FormHelperText>
          </FormControl>
          <LoadingButton
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            pending={isCreateOneUserPending || isUpdateUserPending || isPending}
          >
            Nutzer {id ? "bearbeiten" : "hinzufügen"}
          </LoadingButton>
        </form>
      </div>
    </Container>
  );
}
