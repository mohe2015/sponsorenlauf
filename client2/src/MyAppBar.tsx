import React from "react";
import { Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import AccountCircle from '@material-ui/icons/AccountCircle';
import NotificationsIcon from '@material-ui/icons/Notifications';
import withStyles, { Styles } from "@material-ui/core/styles/withStyles";
import Box from "@material-ui/core/Box";
import ControlledTooltip from "./ControlledTooltip";
import PeopleIcon from '@material-ui/icons/People';
import { Link as RouterLink } from 'react-router-dom';

const styles: Styles<Theme, object> = () => ({
    grow: {
      flexGrow: 1,
    },
  });

type Props = {
  classes: any;
  me: any;
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
                      <Box component="span" display={{ xs: 'none', md: 'block' }}>
                        Nutzer
                      </Box>
                    </Typography>
                  </IconButton>
                </ControlledTooltip>
                <ControlledTooltip title="Nutzer">
                  <IconButton>
                    <AccountCircle />
                    <Typography variant="button" noWrap>
                      <Box component="span" display={{ xs: 'none', md: 'block' }}>
                        {this.props.me.name}
                      </Box>
                    </Typography>
                  </IconButton>
                </ControlledTooltip>
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
