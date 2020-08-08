import React from "react";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import ControlledTooltip from "./ControlledTooltip";
import { Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRunning } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { faEdit } from '@fortawesome/free-regular-svg-icons'
import { Menu, MenuItem } from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Suspense } from 'react';
import Skeleton from '@material-ui/lab/Skeleton';
import { unstable_useTransition as useTransition } from 'react';
import { useNavigate } from "react-router-dom";
import LoadingButton from '@material-ui/lab/LoadingButton';
import { AuthorizationErrorBoundary } from './AuthorizationErrorBoundary';

const useStyles = makeStyles((theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
  }),
);

function AccountButton() {
 /* const data = useLazyLoadQuery(
    graphql`
query MyAppBarQuery {
  me {
    id
    name
  }
}
  `,
  null,
  {fetchPolicy: "store-and-network"})*/

  return (
    <PopupState variant="popover" popupId="demo-popup-menu">
      {(popupState) => (
        <React.Fragment>
            <IconButton
            color="inherit"
            aria-controls="simple-menu" aria-haspopup="true" {...bindTrigger(popupState)}>
              <FontAwesomeIcon icon={faUser} />
              <Typography variant="button" noWrap>
                <Box pl={0.5} component="span" display={{ xs: 'none', md: 'block' }}> 
                Blub
                </Box>
              </Typography>
            </IconButton>
            <Menu {...bindMenu(popupState)}
              getContentAnchorEl={null}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
              }}
            >
              <MenuItem onClick={popupState.close}>Abmelden</MenuItem>
            </Menu>
        </React.Fragment>
      )}
    </PopupState>)
}

function LoadingAccountButton() {
  return (
    <IconButton color="inherit">
      <FontAwesomeIcon icon={faUser} />
      <Typography variant="button" noWrap>
        <Box pl={0.5} component="span" display={{ xs: 'none', md: 'block' }}> 
          <Skeleton variant="text" width={40} />
        </Box>
      </Typography>
    </IconButton>
  )
}

export function MyAppBar() {
  const [startUsersTransition, isUsersPending] = useTransition({ timeoutMs: 30000 });
  const [startRunnersTransition, isRunnersPending] = useTransition({ timeoutMs: 30000 });
  const [startRoundsTransition, isRoundsPending] = useTransition({ timeoutMs: 30000 });
  const [startUserRoundsTransition, isUserRoundsPending] = useTransition({ timeoutMs: 30000 });
  const classes = useStyles();
  const navigate = useNavigate();

  return (<>
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
            pending={isUsersPending} onClick={() => {
                startUsersTransition(() => {
                  navigate("/users")
                });
              }}>
              <FontAwesomeIcon style={{ fontSize: 24 }} icon={faUsers} />
              <Typography variant="button" noWrap>
                <Box ml={1} component="span" display={{ xs: 'none', md: 'block' }}>Nutzer</Box>
              </Typography>
            </LoadingButton>
          </ControlledTooltip>

          <ControlledTooltip title="Läufer">
            <LoadingButton
            variant="contained"
            color="primary"
            disableElevation
            pending={isRunnersPending} onClick={() => {
                startRunnersTransition(() => {
                  navigate("/runners")
                });
              }}>
              <FontAwesomeIcon style={{ fontSize: 24 }} icon={faRunning} />
              <Typography variant="button" noWrap>
                <Box ml={1} component="span" display={{ xs: 'none', md: 'block' }}>Läufer</Box>
              </Typography>
            </LoadingButton>
          </ControlledTooltip>

          <ControlledTooltip title="Runden">
            <LoadingButton
            variant="contained"
            color="primary"
            disableElevation
            pending={isRoundsPending} onClick={() => {
                startRoundsTransition(() => {
                  navigate("/rounds")
                });
              }}>
              <FontAwesomeIcon style={{ fontSize: 24 }} icon={faCircle} />
              <Typography variant="button" noWrap>
                <Box ml={1} component="span" display={{ xs: 'none', md: 'block' }}>Runden</Box>
              </Typography>
            </LoadingButton>
          </ControlledTooltip>

          <ControlledTooltip title="Rundenzählung">
            <LoadingButton
            variant="contained"
            color="primary"
            disableElevation
            pending={isUserRoundsPending} onClick={() => {
                startUserRoundsTransition(() => {
                  navigate("/user-rounds")
                });
              }}>
              <FontAwesomeIcon style={{ fontSize: 24 }} icon={faEdit} />
              <Typography variant="button" noWrap>
                <Box ml={1} component="span" display={{ xs: 'none', md: 'block' }}>Rundenzählung</Box>
              </Typography>
            </LoadingButton>
          </ControlledTooltip>

          <AccountButton />
        </div>
      </Toolbar>
    </AppBar>

    <AuthorizationErrorBoundary>
        <Outlet />
    </AuthorizationErrorBoundary>

    </>
    );
}