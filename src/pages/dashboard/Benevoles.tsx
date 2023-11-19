import { Fragment } from 'react';
import React from 'react';
import { Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, TablePagination } from '@mui/material';

import Title from './Title';
import Benevole from '../../interfaces/Benevole';
import { useLocation } from 'react-router-dom';

interface Column {
  id: 'pseudo' | 'name' | 'email' | 'date';
  label: string;
  minWidth?: number;
  align?: 'right';
  format?: (value: number) => string;
}

const columns: readonly Column[] = [
  { id: 'pseudo', label: 'Pseudo', minWidth: 170 },
  { id: 'name', label: 'Nom', minWidth: 170 },
  { id: 'email', label: 'E-mail', minWidth: 170 },
  {
    id: 'date',
    label: 'Date d\'inscription',
    minWidth: 170,
    align: 'right',
    format: (value: number) => value.toLocaleString('fr-FR'),
  },
];

interface BenevolesProps {
  benevoles: Benevole[];
}

export default function Benevoles({benevoles}: BenevolesProps) {
  
  /* Hooks */
  const location = useLocation();

  /* UseState */
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  
  return (
    <Fragment>
      <Title>{ location.pathname === '/dashboard/benevoles' ? 'Benevoles' : 'Inscription récente' }</Title>
        <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
              {benevoles
              .sort((a, b) => {
                if (a.createdAt > b.createdAt) {
                  return -1;
                }
                if (a.createdAt < b.createdAt) {
                  return 1;
                }
                return 0;
              })
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.pseudo}</TableCell>
                  <TableCell>{`${row.nom} ${row.prenom}`}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell align="right">{row.createdAt.toString().split('T')[0].split('-').reverse().join('/')}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
          component={TableContainer}
          count={benevoles.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Lignes par page"
          labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`}
        />
    </Fragment>
  );
}