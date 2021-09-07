import React from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Box,
  Typography,
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { faStopwatch } from "@fortawesome/free-solid-svg-icons/faStopwatch";

const useStyles = makeStyles((theme) => ({
    wrapper: {
      textAlign: "center",
    },
    contentdiv: {
      display: "inline-block",
    },
}))

export function Countdown() {
  const classes = useStyles();

  // TODO FIXME this calls a mutation with the start time
  // and then counts down?

  return (
    <>
      <Box className={classes.wrapper} mt={8}>
        <LoadingButton size="large" disableElevation>
          <FontAwesomeIcon style={{ fontSize: 24 }} icon={faStopwatch} />
          <Typography variant="button" noWrap>
            <Box ml={1} component="span">
              Countdown starten
            </Box>
          </Typography>
        </LoadingButton>
      </Box>
    </>
  );
}
