import React from "react";
import { Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import withStyles, { Styles } from "@material-ui/core/styles/withStyles";
import Box from "@material-ui/core/Box";
import ControlledTooltip from "./ControlledTooltip";
import PeopleIcon from '@material-ui/icons/People';
import { Link as RouterLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faRunning } from '@fortawesome/free-solid-svg-icons'
import { Menu, MenuItem } from "@material-ui/core";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';

const styles: Styles<Theme, object> = () => ({
    grow: {
      flexGrow: 1,
    },
  });

type Props = {
  classes: any;
  //me: any;
};

type State = {
  anchorEl: HTMLElement | null;
  mobileMoreAnchorEl: HTMLElement | null;
};

class MyAppBar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    this.state = {
      anchorEl: null,
      mobileMoreAnchorEl: null,
    };
  }

  handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    console.log(event.currentTarget);
    console.log(this.state.anchorEl);
    this.setState({anchorEl: event.currentTarget});
  };

  handleMobileMenuClose = () => {
    this.setState({mobileMoreAnchorEl: null});
  };

  handleMenuClose = () => {
    this.setState({
      anchorEl: null
    });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    this.setState({mobileMoreAnchorEl: event.currentTarget});
  };

  render() {
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.grow}>
          <AppBar position="static">
            <Toolbar>
              <Typography className={classes.title} variant="h6" noWrap>
                Sponsorenlauf
              </Typography>
              <div className={classes.grow} />
              <div className={classes.sectionDesktop}>
                <ControlledTooltip title="Nutzer">
                  <IconButton component={RouterLink} to="/users">
                    <PeopleIcon />
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
                          <FontAwesomeIcon icon={faRunning} />
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
                          <MenuItem onClick={popupState.close}>Cake</MenuItem>
                          <MenuItem onClick={popupState.close}>Death</MenuItem>
                        </Menu>
                    </React.Fragment>
                  )}
                </PopupState>

                 
              </div>
            </Toolbar>
          </AppBar>
        </div>
        <div>
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(MyAppBar);
