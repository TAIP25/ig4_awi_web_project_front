import { Box, Paper, Stack, Typography } from "@mui/material"

import Switch from "../planning/Switch"
import React, { useEffect, useState } from "react"
import MonInscriptionBenevole from "../../interfaces/MonInscriptionBenevole"
import Festival from "../../interfaces/Festival"
import axios from "axios"
import { decodeToken } from "react-jwt"
import Cookies from 'js-cookie';
import CreneauHoraire from "../../interfaces/CreneauHoraire"
import Poste from "../../interfaces/Poste"
//import "./Home.scss"

const NEWS = [
  {
    id: 1,
    title: "News 1",
    content: "Content 1"
  },
  {
    id: 2,
    title: "News 2",
    content: "Content 2"
  }
]

const EVENTS = [
  {
    id: 1,
    title: "Event 1",
    content: "Content 1"
  },
  {
    id: 2,
    title: "Event 2",
    content: "Content 2"
  }
]

const REFERENTS = [
  {
    id: 1,
    title: "Referent 1",
    content: "email@example.com"
  },
  {
    id: 2,
    title: "Referent 2",
    content: "email@example.com"
  }
]


export default function Home(){
  /* Variables */
  //TODO: handle week if the festival is not on saturday and sunday
  //Refactor with planning component
  const week: string[] = ["Samedi", "Dimanche"];

  /* UseState */
  const [jour, setJour] = React.useState(week[0]);
  const [myInscriptionBenevole, setMyInscriptionBenevole] = React.useState<MonInscriptionBenevole[]>([]);
  const [creneauxHoraires, setCreneauxHoraires] = useState<CreneauHoraire[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [festival, setFestival] = React.useState<Festival | null>(null);

  /* UseEffect */
  // Fetch festival data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/festival/next`);
        const festival: Festival = res.data;
        setFestival(festival);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    const fetchData = async () => {
      if(festival === null) return;
      try {
        const benevoleID: number = getCookiesBenevoleID();
        const [res1, res2, res3] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festival!.id}/benevole/${benevoleID}`),
          axios.get(`${import.meta.env.VITE_API_URL}/poste/festival/${festival?.id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/creneauHoraire`)
        ]);

        const creneauxHoraires: CreneauHoraire[] = res3.data.creneauHoraire;
        const postes: Poste[] = res2.data.postes;

        let myInscriptionBenevoleTemp: MonInscriptionBenevole[] = res1.data.inscription.map((inscription: any) => {
          const myInscriptionBenevole: MonInscriptionBenevole = {
            id: inscription.id,
            creneauHoraireID: inscription.creneauHoraireID,
            posteID: inscription.posteID,
            status: inscription.status,
          };
          return myInscriptionBenevole;
        });

        // Filter que les inscriptions Accepté
        myInscriptionBenevoleTemp = myInscriptionBenevoleTemp.filter((inscription: MonInscriptionBenevole) => inscription.status === "Accepté");

        setMyInscriptionBenevole(myInscriptionBenevoleTemp);
        setCreneauxHoraires(creneauxHoraires);
        setPostes(postes);
        
      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, [festival]);

  /* Functions */
  function getCookiesBenevoleID() {
    const decodedToken: any = decodeToken(Cookies.get('token')!)
    const benevoleID: number = decodedToken.id_benevole
    return benevoleID
  }

  function getCreneauHoraireByDay(day: string): CreneauHoraire[] {
    return creneauxHoraires.filter((creneauHoraire) => creneauHoraire.jour === day)
  }

  return(
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
        Accueil
      </Typography>
      <Stack spacing={10} direction="row" sx={{ p: 10, marginLeft: '3rem', marginRight: '3rem' }}>
        <Stack spacing={2} sx={{ width: "100%" }}>
        <Switch week={week} setJour={setJour} jour={jour} sx={{ alignSelf: "flex-start" }} />
          <Paper sx={{ p: 2, borderColor: "secondary.main", borderWidth: "2px", borderStyle: "solid" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              Planning
            </Typography>
            <Stack spacing={2} direction="row" sx={{ justifyContent: "center" }}>
              {getCreneauHoraireByDay(jour).map((creneauHoraire) => (
                <Paper key={creneauHoraire.id} sx={{ p: 2, borderColor: "primary.main", borderWidth: "2px", borderStyle: "solid" }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                    {creneauHoraire.heureDebut}h - {creneauHoraire.heureFin}h
                  </Typography>
                  <Stack spacing={2}>
                    <Typography variant="body1" component="div" display={"flex"} justifyContent={"center"} sx={{ fontWeight: postes.find((poste: Poste) => poste.id === myInscriptionBenevole.find((inscription: MonInscriptionBenevole) => inscription.creneauHoraireID === creneauHoraire.id)?.posteID) ? "bold" : "normal" }}>
                      {postes.find((poste: Poste) => poste.id === myInscriptionBenevole.find((inscription: MonInscriptionBenevole) => inscription.creneauHoraireID === creneauHoraire.id)?.posteID)?.nom || "Aucun poste"}
                    </Typography>
                  </Stack>
                </Paper>
              ))}
            </Stack>
          </Paper>
          <Paper sx={{ p: 2, borderColor: "secondary.main", borderWidth: "2px", borderStyle: "solid" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              Reference
            </Typography>
            <Stack spacing={2}>
              {REFERENTS.map((referent) => (
                <Paper key={referent.id} sx={{ p: 2, borderColor: "primary.main", borderWidth: "2px", borderStyle: "solid" }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                    {referent.title}
                  </Typography>
                  <Typography variant="body1" component="div" display={"flex"} justifyContent={"center"}>
                    {referent.content}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Stack>
        <Stack spacing={2} sx={{ width: "35%" }}>
          <Paper sx={{ p: 2, borderColor: "secondary.main", borderWidth: "2px", borderStyle: "solid"}}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              News
            </Typography>
            <Stack spacing={2}>
              {NEWS.map((news) => (
                <Paper key={news.id} sx={{ p: 2, borderColor: "primary.main", borderWidth: "2px", borderStyle: "solid" }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                    {news.title}
                  </Typography>
                  <Typography variant="body1" component="div" display={"flex"} justifyContent={"center"}>
                    {news.content}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
          <Paper sx={{ p: 2, borderColor: "secondary.main", borderWidth: "2px", borderStyle: "solid" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              Soirée
            </Typography>
            <Stack spacing={2}>
              {EVENTS.map((event) => (
                <Paper key={event.id} sx={{ p: 2, borderColor: "primary.main", borderWidth: "2px", borderStyle: "solid" }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                    {event.title}
                  </Typography>
                  <Typography variant="body1" component="div" display={"flex"} justifyContent={"center"}>
                    {event.content}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  )
}