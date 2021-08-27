import React from "react";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles({
  root: {
    width: "100%",
  },
});

export function NotFound() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Typography align="center" variant="h1">
        Seite nicht gefunden
      </Typography>
    </div>
  );
}
