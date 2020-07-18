import React from "react";
import { useFragment } from 'react-relay/hooks';
import graphql from "babel-plugin-relay/macro";

export function UserRow(props) {
  const data = useFragment(
    graphql`
    fragment UserRow_user on User {
      id
      name
      role
    }
    `,
    props.user,
  );

  return (
    <TableRow key={data.name}>
      <TableCell component="th" scope="row">
        {data.name}
      </TableCell>
      <TableCell align="right">{data.role}</TableCell>
      <TableCell align="right">
        <ControlledTooltip title="Löschen">
          <IconButton>
            <DeleteIcon />
            <Typography variant="button" noWrap>
              <Box component="span" display={{ xs: 'none', md: 'block' }}>
              Löschen
              </Box>
            </Typography>
          </IconButton>
        </ControlledTooltip>
      </TableCell>
    </TableRow>
  );
}