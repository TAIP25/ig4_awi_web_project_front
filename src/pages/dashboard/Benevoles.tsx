import { Fragment } from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import Title from './Title';
import Benevole from '../../interfaces/Benevole';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Orders({benevoles}: {benevoles: Benevole[]}) {



  return (
    <Fragment>
      <Title>Inscription récente</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Pseudo</TableCell>
            <TableCell>Nom</TableCell>
            <TableCell>E-mail</TableCell>
            <TableCell align="right">Date</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {benevoles.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.pseudo}</TableCell>
              <TableCell>{`${row.nom} ${row.prenom}`}</TableCell>
              <TableCell>{row.email}</TableCell>
              <TableCell align="right">{row.createdAt.toString().split('T')[0]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{ mt: 3 }}>
        Voir plus
      </Link>
    </Fragment>
  );
}