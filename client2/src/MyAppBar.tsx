import React, { ChangeEvent } from "react";
import Container from "@material-ui/core/Container";
import { QueryRenderer } from 'react-relay';
import { graphql } from "babel-plugin-relay/macro";
import environment from "./Environment";
import { Navigate } from "react-router-dom";
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import withStyles, { Styles } from "@material-ui/core/styles/withStyles";
import Box from "@material-ui/core/Box";

const styles: Styles<Theme, object> = (theme: Theme) => ({
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    inputRoot: {
      color: 'inherit',
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
    sectionDesktop: {
      display: 'flex',
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
      <div className={classes.grow}>
        <AppBar position="static">
          <Toolbar>
            <Typography className={classes.title} variant="h6" noWrap>
              Sponsorenlauf
            </Typography>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
              <IconButton aria-label="show 4 new mails" color="inherit">
                <Badge badgeContent={4} color="secondary">
                  <MailIcon />
                </Badge>
              </IconButton>
              <IconButton aria-label="show 17 new notifications" color="inherit">
                <Badge badgeContent={17} color="secondary">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"

              >
                <AccountCircle /> <Box component="span" display={{ xs: 'none', md: 'block' }}>
                  {this.props.me.name}
                </Box>
              </IconButton>
            </div>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

export default withStyles(styles)(MyAppBar);
