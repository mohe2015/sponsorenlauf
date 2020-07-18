import React from "react";
import { createStyles, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Box from "@material-ui/core/Box";
import ControlledTooltip from "./ControlledTooltip";
import { Link as RouterLink, Outlet } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRunning } from '@fortawesome/free-solid-svg-icons'
import { faUser } from '@fortawesome/free-solid-svg-icons'
import { faUsers } from '@fortawesome/free-solid-svg-icons'
import { Menu, MenuItem } from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import { Suspense } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) =>
  createStyles({
    grow: {
      flexGrow: 1,
    },
  }),
);


export function MyAppBar() {
  const classes = useStyles();

  return (
    <div>
  <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" noWrap className={classes.grow}>
          Sponsorenlauf
        </Typography>
        <div>
          <ControlledTooltip title="Nutzer">
            <IconButton component={RouterLink} to="/users">
              <FontAwesomeIcon icon={faUsers} />
              <Typography variant="button" noWrap>
                <Box pl={0.5} component="span" display={{ xs: 'none', md: 'block' }}> Nutzer</Box>
              </Typography>
            </IconButton>
          </ControlledTooltip>
          <ControlledTooltip title="Läufer">
            <IconButton component={RouterLink} to="/runners">
              <FontAwesomeIcon icon={faRunning} />
              <Typography variant="button" noWrap>
                <Box pl={0.5} component="span" display={{ xs: 'none', md: 'block' }}> 
                Läufer
                </Box>
              </Typography>
            </IconButton>
          </ControlledTooltip>

          <PopupState variant="popover" popupId="demo-popup-menu">
            {(popupState) => (
              <React.Fragment>
                  <IconButton aria-controls="simple-menu" aria-haspopup="true" {...bindTrigger(popupState)}>
                    <FontAwesomeIcon icon={faUser} />
                    <Typography variant="button" noWrap>
                      <Box pl={0.5} component="span" display={{ xs: 'none', md: 'block' }}> 
                      Account
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
          </PopupState>

            
        </div>
      </Toolbar>
    </AppBar>

    <Suspense fallback={<CircularProgress />}>
      <Outlet />
    </Suspense>

    </div>
    );
}