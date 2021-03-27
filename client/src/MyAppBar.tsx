import React, { useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ControlledTooltip from "./ControlledTooltip";
import { Outlet } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRunning } from "@fortawesome/free-solid-svg-icons/faRunning";
import { faList } from "@fortawesome/free-solid-svg-icons/faList";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faCircle } from "@fortawesome/free-regular-svg-icons/faCircle";
import { faEdit } from "@fortawesome/free-regular-svg-icons/faEdit";
import { Menu, MenuItem } from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from "material-ui-popup-state";
import { Suspense } from "react";
import Skeleton from "@material-ui/lab/Skeleton";
import { unstable_useTransition as useTransition } from "react";
import { useNavigate } from "react-router-dom";
import LoadingButton from "@material-ui/lab/LoadingButton";
import { AuthorizationErrorBoundary } from "./AuthorizationErrorBoundary";
import { LoadingContext } from "./LoadingContext";
import { useMutation, useLazyLoadQuery } from "react-relay/hooks";
import { AuthContext } from "./RelayEnvironmentProviderWrapper";
import { MyAppBarQuery } from "./__generated__/MyAppBarQuery.graphql";
import graphql from 'babel-plugin-relay/macro';

const useStyles = makeStyles((theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
  })
);

function AccountButton() {
  const { resetEnvironment } = useContext(AuthContext);

  const [startTransition, isPending] = useTransition({ busyDelayMs: 1000, busyMinDurationMs: 1500  });

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
            aria-haspopup="true"
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
            getContentAnchorEl={null}
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
                pending={isLogoutPending || isPending}
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
  const [startUsersTransition, isUsersPending] = useTransition({
    busyDelayMs: 1000, busyMinDurationMs: 1500 
  });
  const [startRunnersTransition, isRunnersPending] = useTransition({
    busyDelayMs: 1000, busyMinDurationMs: 1500 
  });
  const [
    startRunnersByClassTransition,
    isRunnersByClassPending,
  ] = useTransition({ busyDelayMs: 1000, busyMinDurationMs: 1500  });
  const [startRoundsTransition, isRoundsPending] = useTransition({
    busyDelayMs: 1000, busyMinDurationMs: 1500 
  });
  const [startUserRoundsTransition, isUserRoundsPending] = useTransition({
    busyDelayMs: 1000, busyMinDurationMs: 1500 
  });
  const classes = useStyles();
  const navigate = useNavigate();

  return (
    <>
      <AuthorizationErrorBoundary>
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
                    pending={isUsersPending}
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
                    pending={isRunnersPending}
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
                    pending={isRunnersByClassPending}
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
                    pending={isRoundsPending}
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
                    pending={isUserRoundsPending}
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

        <Suspense
          fallback={
            <LoadingContext.Provider value={true}>
              <Outlet />
            </LoadingContext.Provider>
          }
        >
          <LoadingContext.Provider value={false}>
            <Outlet />
          </LoadingContext.Provider>
        </Suspense>
      </AuthorizationErrorBoundary>
    </>
  );
}
