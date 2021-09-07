import React, { useContext } from "react";
import { makeStyles } from "@mui/styles";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import ControlledTooltip from "./ControlledTooltip";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRunning } from "@fortawesome/free-solid-svg-icons/faRunning";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faCircle } from "@fortawesome/free-regular-svg-icons/faCircle";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import { Menu, MenuItem } from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Suspense } from "react";
import Skeleton from "@mui/material/Skeleton";
import { useTransition } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@mui/lab/LoadingButton";
import { useMutation, useLazyLoadQuery } from "react-relay/hooks";
import { AuthContext } from "./AuthContext";
import { MyAppBarQuery } from "./__generated__/MyAppBarQuery.graphql";
import graphql from 'babel-plugin-relay/macro';

const useStyles = makeStyles({
    grow: {
      flexGrow: 1,
    },
  });
  

function AccountButton() {
  const { resetEnvironment } = useContext(AuthContext);

  const [isPending, startTransition] = useTransition();

  const navigate = useNavigate();

  const [logout, isLogoutPending] = useMutation(graphql`
    mutation MyAppBarLogoutMutation {
      logout
    }
  `);

  const data = useLazyLoadQuery<MyAppBarQuery>(
    graphql`
      query MyAppBarQuery {
        me {
          id
          name
        }
      }
    `,
    {},
    { fetchPolicy: "store-and-network" }
  );

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
          <IconButton
            color="inherit"
            aria-controls="simple-menu"
            {...bindTrigger(popupState)}
          >
            <FontAwesomeIcon icon={faUser} />
            <Typography variant="button" noWrap>
              <Box
                pl={0.5}
                component="span"
                display={{ xs: "none", md: "block" }}
              >
                {data.me.name}
              </Box>
            </Typography>
          </IconButton>
          <Menu
            {...bindMenu(popupState)}
            anchorEl={null}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "center",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
          >
            <MenuItem
              onClick={(e) => {
                logout({
                  variables: {},
                  onCompleted: (response, errors) => {
                    resetEnvironment();
                    popupState.close();

                    if (errors !== null) {
                      console.log(errors);
                      alert(
                        "Fehler: " + errors.map((e) => e.message).join(", ")
                      );
                    } else {
                      startTransition(() => {
                        navigate("/login");
                      });
                    }
                  },
                  onError: (error) => {
                    alert(error); // TODO FIXME
                  },
                });
              }}
            >
              <LoadingButton
                disableElevation
                loading={isLogoutPending || isPending}
                onClick={() => 1}
              >
                <Typography variant="button" noWrap>
                  <Box component="span" ml={1}>
                    Abmelden
                  </Box>
                </Typography>
              </LoadingButton>
            </MenuItem>
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );
}

function LoadingAccountButton() {
  return (
    <IconButton color="inherit">
      <FontAwesomeIcon icon={faUser} />
      <Typography variant="button" noWrap>
        <Box pl={0.5} component="span" display={{ xs: "none", md: "block" }}>
          <Skeleton variant="text" width={40} />
        </Box>
      </Typography>
    </IconButton>
  );
}

export function MyAppBar() {
  const [isUsersPending, startUsersTransition, ] = useTransition();
  const [isRunnersPending, startRunnersTransition, ] = useTransition();
  const [
    isRunnersByClassPending,
    startRunnersByClassTransition,
  ] = useTransition();
  const [isRoundsPending, startRoundsTransition, ] = useTransition();
  const [isUserRoundsPending, startUserRoundsTransition, ] = useTransition();
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <>
        <Box displayPrint="none">
          <AppBar position="static">
            <Toolbar>
              <Typography variant="h6" noWrap className={classes.grow}>
                Sponsorenlauf
              </Typography>
              <div>
                <ControlledTooltip title="Nutzer">
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    disableElevation
                    loading={isUsersPending}
                    onClick={() => {
                      startUsersTransition(() => {
                        navigate("/users");
                      });
                    }}
                  >
                    <FontAwesomeIcon style={{ fontSize: 24 }} icon={faUsers} />
                    <Typography variant="button" noWrap>
                      <Box
                        ml={1}
                        component="span"
                        display={{ md: "none", lg: "block" }}
                      >
                        Nutzer
                      </Box>
                    </Typography>
                  </LoadingButton>
                </ControlledTooltip>

                <ControlledTooltip title="Läufer">
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    disableElevation
                    loading={isRunnersPending}
                    onClick={() => {
                      startRunnersTransition(() => {
                        navigate("/runners");
                      });
                    }}
                  >
                    <FontAwesomeIcon
                      style={{ fontSize: 24 }}
                      icon={faRunning}
                    />
                    <Typography variant="button" noWrap>
                      <Box
                        ml={1}
                        component="span"
                        display={{ md: "none", lg: "block" }}
                      >
                        Läufer
                      </Box>
                    </Typography>
                  </LoadingButton>
                </ControlledTooltip>

                <ControlledTooltip title="Läuferliste">
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    disableElevation
                    loading={isRunnersByClassPending}
                    onClick={() => {
                      startRunnersByClassTransition(() => {
                        navigate("/by-class-runners");
                      });
                    }}
                  >
                    <FontAwesomeIcon style={{ fontSize: 24 }} icon={faList} />
                    <Typography variant="button" noWrap>
                      <Box
                        ml={1}
                        component="span"
                        display={{ md: "none", lg: "block" }}
                      >
                        Läuferliste
                      </Box>
                    </Typography>
                  </LoadingButton>
                </ControlledTooltip>

                <ControlledTooltip title="Runden">
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    disableElevation
                    loading={isRoundsPending}
                    onClick={() => {
                      startRoundsTransition(() => {
                        navigate("/rounds");
                      });
                    }}
                  >
                    <FontAwesomeIcon style={{ fontSize: 24 }} icon={faCircle} />
                    <Typography variant="button" noWrap>
                      <Box
                        ml={1}
                        component="span"
                        display={{ md: "none", lg: "block" }}
                      >
                        Runden
                      </Box>
                    </Typography>
                  </LoadingButton>
                </ControlledTooltip>

                <ControlledTooltip title="Rundenzählung">
                  <LoadingButton
                    variant="contained"
                    color="primary"
                    disableElevation
                    loading={isUserRoundsPending}
                    onClick={() => {
                      startUserRoundsTransition(() => {
                        navigate("/user-rounds");
                      });
                    }}
                  >
                    <FontAwesomeIcon style={{ fontSize: 24 }} icon={faEdit} />
                    <Typography variant="button" noWrap>
                      <Box
                        ml={1}
                        component="span"
                        display={{ md: "none", lg: "block" }}
                      >
                        Rundenzählung
                      </Box>
                    </Typography>
                  </LoadingButton>
                </ControlledTooltip>

                <Suspense fallback={<LoadingAccountButton />}>
                  <AccountButton />
                </Suspense>
              </div>
            </Toolbar>
          </AppBar>
        </Box>

        <Outlet />
    </>
  );
}
