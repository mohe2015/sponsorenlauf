import React from "react";
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/styles";


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
