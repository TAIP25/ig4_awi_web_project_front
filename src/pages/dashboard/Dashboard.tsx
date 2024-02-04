import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';

import Chart from './Chart';
import Overview from './Overview';
import Benevoles from './Benevoles';
import ReservationBenevoles from './ReservationBenevoles';
import ImportCSV from './ImportCSV';
import Benevole from '../../interfaces/Benevole';
import { useLocation } from 'react-router-dom';
//import BenevolesBIS from './BenevolesBIS.tsx';

// TODO remove, this demo shouldn't need to reset the theme.
// TODO fix BenevolesBIS.tsx and refactor this file to use it instead of Benevoles.tsx


export default function Dashboard() {

  /* Hooks */
  const location = useLocation();

  /* UseState */
  const [benevoles, setBenevoles] = useState<Benevole[]>([]);

  /* UseEffect */
  useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/benevole/`)
      .then(response => {
          setBenevoles(response.data)
      })
  }, [])

  return (
    <Box
    component="main"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    }}
    >
      <Toolbar />
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          {/* Chart */}
          { location.pathname === '/dashboard' &&
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Chart benevoles={benevoles} />
            </Paper>
          </Grid>
          }
          {/* Overview */}
          { location.pathname === '/dashboard' &&
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                height: 240,
              }}
            >
              <Overview benevoles={benevoles} />
            </Paper>
          </Grid>
          }
          {/* Recent Inscriptions */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              {/*onlyBenevoles ? 
              <BenevolesBIS benevoles={benevoles} /> : 
              <Benevoles benevoles={benevoles} onlyBenevoles={onlyBenevoles} />*/}
              <Benevoles benevoles={benevoles} />
            </Paper>
          </Grid>
          {/* Demande de reservation */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <ReservationBenevoles/>
            </Paper>
          </Grid>

          {/* Import du CSV */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <ImportCSV/>
            </Paper>
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}