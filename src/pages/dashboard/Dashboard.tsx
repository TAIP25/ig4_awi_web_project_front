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
import ImportCSV from './ImportCSV';
import Benevole from '../../interfaces/Benevole';
import { useLocation } from 'react-router-dom';
import HandlePoste from './HandlePoste';
import Festival from '../../interfaces/Festival';
import FestivalSelect from './FestivalSelect';
import { Divider } from '@mui/material';
import ReservationBenevoles from './ReservationBenevoles';
//import BenevolesBIS from './BenevolesBIS.tsx';

// TODO remove, this demo shouldn't need to reset the theme.
// TODO fix BenevolesBIS.tsx and refactor this file to use it instead of Benevoles.tsx


export default function Dashboard() {

  /* Hooks */
  const location = useLocation();

  /* UseState */
  const [benevoles, setBenevoles] = useState<Benevole[]>([]);
  const [currentFestival, setCurrentFestival] = useState<number>(-1);
  const [_nextFestival, setNextFestival] = useState<number>(-1);
  const [allFestivals, setAllFestivals] = useState<Festival[]>([]);

  /* UseEffect */
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/festival/`)
    axios.get(`${import.meta.env.VITE_API_URL}/benevole/`)
    .then(response => {
      setBenevoles(response.data)
    })
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/festival/`),
          axios.get(`${import.meta.env.VITE_API_URL}/festival/next`),
        ]);

        setAllFestivals(res1.data);
        setCurrentFestival(res2.data.id);
        setNextFestival(res2.data.id);
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);      

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
          <Grid item xs={12}>
            <Divider sx={{ mb: 2, mt: 2 }} />
            {/* Festival selection */}
            { currentFestival !== -1 && 
              <FestivalSelect currentFestival={currentFestival} setCurrentFestival={setCurrentFestival} allFestivals={allFestivals} />
            }
          </Grid>
          {/* Demande de reservation */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              {<ReservationBenevoles/>}
            </Paper>
          </Grid>
          {/* Gestion des postes */}
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
              <HandlePoste currentFestival={currentFestival} />
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