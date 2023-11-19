import { useEffect, useState } from 'react';
import axios from 'axios';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Link from '@mui/material/Link';

import Chart from './Chart';
import Overview from './Overview';
import Benevoles from './Benevoles';
import Benevole from '../../interfaces/Benevole';
import { useLocation } from 'react-router-dom';
//import BenevolesBIS from './BenevolesBIS.tsx';

// TODO remove, this demo shouldn't need to reset the theme.
// TODO fix BenevolesBIS.tsx and refactor this file to use it instead of Benevoles.tsx


function Copyright(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Dashboard() {

  /* Hooks */
  const location = useLocation();

  /* UseState */
  const [benevoles, setBenevoles] = useState<Benevole[]>([]);

  /* UseEffect */
  useEffect(() => {
      axios.get(`${import.meta.env.VITE_API_URL}/benevoles/`, undefined)
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
        </Grid>
        <Copyright sx={{ pt: 4 }} />
      </Container>
    </Box>
  );
}