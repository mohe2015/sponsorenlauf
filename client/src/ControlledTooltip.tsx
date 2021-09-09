import React from "react";
import Tooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

export default function ControlledTooltip(props: {
  title: string;
  children: React.ReactElement;
}) {
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(matches);
  };

  return (
    <Tooltip
      open={open}
      onClose={handleClose}
      onOpen={handleOpen}
      title={props.title}
    >
      {props.children}
    </Tooltip>
  );
}
