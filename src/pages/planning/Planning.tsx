import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import CreneauHoraire from "../../interfaces/CreneauHoraire";
import Poste from "../../interfaces/Poste";
import { decodeToken } from "react-jwt";

export default function Planning() {
  /* Variables */
  //TODO: handle festivalID
  const festivalID = 1;

  /* UseState */
  const [creneauxHoraires, setCreneauxHoraires] = useState<CreneauHoraire[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [jour, setJour] = useState<string>("Samedi");

  /* UseEffect */
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/creneauHoraire/`, undefined)
    .then(response => {
      setCreneauxHoraires(response.data.creneauHoraire)
    })
    const req1 = axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festivalID}/count`, undefined)
    const req2 = axios.get(`${import.meta.env.VITE_API_URL}/poste/festival/${festivalID}`, undefined)
    
    axios.all([req1, req2])
    .then(axios.spread((...responses) => {
      // Merge responses
      const res1 = responses[0]
      const res2 = responses[1]
      // TODO: In progress
      const postes: Poste[] = res2.data.poste.map((poste: Poste) => {
        const nombreBenevolesActuel = res1.data.inscription.filter((inscription: any) => inscription.posteID === poste.id)._count
        poste.nombreBenevolesActuel = nombreBenevolesActuel ? nombreBenevolesActuel : 0
        return poste
      })
      console.log(postes)
      //setPostes(postes)
    }))
    
  }, [])

  /* Functions */
  function getCreneauHoraireByDay(day: string) {
    return creneauxHoraires.filter((creneauHoraire) => creneauHoraire.jour === day)
  }

  function getCookiesBenevoleID() {
    const decodedToken: any = decodeToken(Cookies.get('token')!)
    const benevoleID: number = decodedToken.id_benevole
    console.log("Benevole ID: " + benevoleID)
    return benevoleID
  }

  function reserver(creneauHoraire: CreneauHoraire, poste: Poste) {
    console.log("Réserver: " + creneauHoraire.jour + " " + creneauHoraire.heureDebut + "h - " + creneauHoraire.heureFin + "h" + " " + poste.nom)
    handleReservation(creneauHoraire, poste, festivalID, getCookiesBenevoleID())
  }

  function handleReservation(creneauHoraire: CreneauHoraire, poste: Poste, festival: number, benevole: number) {
    axios.post(`${import.meta.env.VITE_API_URL}/inscriptionBenevole`, {
      benevoleID: benevole,
      festivalID: festival,
      creneauHoraireID: creneauHoraire.id,
      posteID: poste.id,
    }).then((response) => {
      console.log(response);
    }).catch((error) => {
      console.log(error);
    });
  }

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
      <Typography 
      variant="h1"
      component="div"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        p: 2,
        fontWeight: "bold",
        fontSize: "4rem",
      }}
      >
        Planning
      </Typography>
      <Paper sx={{ p: 2, marginLeft: '3rem', marginRight: '3rem', marginBottom: '1rem', flexGrow: 1, width: "15%", minWidth: "200px" }}>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="secondary" sx={{ width: "100%", height: "100%" }} onClick={() => {setJour("Samedi")}} disabled={jour === "Samedi"}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              Samedi
            </Typography>
          </Button>
          <Button variant="contained" color="secondary" sx={{ width: "100%", height: "100%" }} onClick={() => {setJour("Dimanche")}} disabled={jour === "Dimanche"}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              Dimanche
            </Typography>
          </Button>
        </Stack>
      </Paper>
      <Paper sx={{ p: 2, marginLeft: '3rem', marginRight: '3rem' }}>
        <Stack spacing={2}>
          <Stack direction="row" spacing={2} key={0}>
            <Paper sx={{ margin: 'auto', flexGrow: 1, width: "100%", backgroundColor: "secondary.main" }}/>
            {getCreneauHoraireByDay(jour)
            .map((creneauHoraire) => (
              <Paper key={creneauHoraire.id} sx={{ margin: 'auto', flexGrow: 1, width: "100%", color: "white", backgroundColor: "primary.main" }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                  {creneauHoraire.heureDebut}h - {creneauHoraire.heureFin}h
                </Typography>
              </Paper>
            ))}
          </Stack>
          {postes.map((poste) => (
            <Stack direction="row" spacing={2} key={poste.id}>
              <Paper sx={{ margin: 'auto', flexGrow: 1, width: "100%", color: "white", backgroundColor: "primary.main", display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                  {poste.nom}
                </Typography>
              </Paper>   
              {getCreneauHoraireByDay(jour)
              .map((creneauHoraire) => (
                <Paper key={creneauHoraire.id} sx={{ margin: 'auto', flexGrow: 1, width: "100%"}}>
                  <Button variant="contained" color="secondary" sx={{ width: "100%", height: "100%" }} onClick={() => {reserver(creneauHoraire, poste)}}>
                    <Stack>
                      <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                        Réserver
                      </Typography>
                      <Box sx={{ width: '100%' }}>
                        <LinearProgress variant="determinate" value={Math.floor(Math.random() * 100)} color="warning" />
                      </Box>
                    </Stack>
                  </Button>
                </Paper>
              ))}
            </Stack>
          ))}
        </Stack>
      </Paper>
    </Box>
  );
}