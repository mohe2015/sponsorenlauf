import React from 'react';
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';

export default function ControlledTooltip(props: any) {
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(true);
  };

  const handleOpen = () => {
    setOpen(false);
  };

  return (
    <Tooltip open={open} onClose={handleClose} onOpen={handleOpen} title="Add">
      {props.children}
    </Tooltip>
  );
}