import { Fragment } from 'react';

import Title from './Title';
import Benevole from '../../interfaces/Benevole';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Box } from '@mui/material';

const columns: GridColDef[] = [
  { field: 'pseudo', headerName: 'Pseudo', width: 170 },
  { field: 'nom', headerName: 'Nom', width: 170 },
  { field: 'email', headerName: 'E-mail', width: 170 },
  {
    field: 'createdAt',
    headerName: 'Date d\'inscription',
    width: 170,
    align: 'right',
    type: 'dateTime',
    valueFormatter: (params) => params.value.toString().split('T')[0].split('-').reverse().join('/'),
  },
];

  interface BenevolesProps {
    benevoles: Benevole[];
  }

  export default function BenevolesBIS({benevoles}: BenevolesProps) {
  
  return (
    <Fragment>
      <Title>Benevoles</Title>
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={benevoles}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              }
            },
          }}
          pageSizeOptions={[5]}
          checkboxSelection
          disableRowSelectionOnClick
        />
      </Box>
    </Fragment>
  );
}