import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import CreneauHoraire from "../../interfaces/CreneauHoraire";
import Poste from "../../interfaces/Poste";
import Festival from "../../interfaces/Festival";
import { decodeToken } from "react-jwt";
import InscriptionBenevole from "../../interfaces/InscriptionBenevole";

//TODO: refactor code and file
export default function Planning() {
  /* Variables */
  //TODO: handle festivalID
  const festivalID = 3;

  /* UseState */
  const [festival, setFestival] =  useState<Festival | null>(null);
  const [creneauxHoraires, setCreneauxHoraires] = useState<CreneauHoraire[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [inscriptionBenevole, setInscriptionBenevole] = useState<InscriptionBenevole[]>([]);
  //TODO: handle myInscriptionBenevole
  const [myInscriptionBenevole, setMyInscriptionBenevole] = useState<InscriptionBenevole[]>([]);
  const [jour, setJour] = useState<string>("Samedi");

  // Fetch festival data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/festival/next`);
        const festival: Festival = res.data;
        setFestival(festival);

        
        console.log("Festival édition " + festival.edition);
      } catch (error) {
        console.error(error);
      }
    };
  
    fetchData();
  }, []);

  /* UseEffect */
  useEffect(() => {

    if(festival){
      const fetchData = async () => {
        try {

          console.log("Festival id :");
          console.log(festival?.id);
  
          const [res1, res2, res3] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festival?.id}/count`),
            axios.get(`${import.meta.env.VITE_API_URL}/poste/festival/${festival?.id}`),
            axios.get(`${import.meta.env.VITE_API_URL}/creneauHoraire`),
          ]);
    
          const creneauxHoraires: CreneauHoraire[] = res3.data.creneauHoraire;
          
          
          const postes: Poste[] = res2.data.postes;
          
            

          
  
          const inscriptionBenevoleTemp: InscriptionBenevole[] = res1.data.inscription.map((inscription: any) => {
            const nombreMax: any = postes.find((poste) => poste.id === inscription.posteID)?.nombreBenevoles || 1
            const inscriptionBenevole: InscriptionBenevole = {
              creneauHoraireID: inscription.creneauHoraireID,
              posteID: inscription.posteID,
              nombreInscrits: inscription._count.id,
              nombreMax: nombreMax,
            };
            return inscriptionBenevole;
          });
  
          setCreneauxHoraires(creneauxHoraires);
          setPostes(postes);
          setInscriptionBenevole(inscriptionBenevoleTemp);
        } catch (error) {
          console.error(error);
        }

      }
      fetchData();
    };
  
  }, [festival]);

  // use effect to update progress bars when inscriptionBenevole is updated
  useEffect(() => {

    if(festival){
      const fetchData = async () => {
        try {
          const benevoleID: number = getCookiesBenevoleID();
          const [res1, res2] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festival?.id}/count`),
            axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festival?.id}/benevole/${benevoleID}`),
          ]);
  
          const inscriptionBenevoleTemp: InscriptionBenevole[] = res1.data.inscription.map((inscription: any) => {
            const nombreMax: any = postes.find((poste) => poste.id === inscription.posteID)?.nombreBenevoles || 1
            const inscriptionBenevole: InscriptionBenevole = {
              creneauHoraireID: inscription.creneauHoraireID,
              posteID: inscription.posteID,
              nombreInscrits: inscription._count.id,
              nombreMax: nombreMax,
            };
            return inscriptionBenevole;
          });
          if(inscriptionBenevoleTemp !== inscriptionBenevole) {
            setInscriptionBenevole(inscriptionBenevoleTemp);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }
    
  }, [inscriptionBenevole]);

  /* Functions */
  function getCreneauHoraireByDay(day: string) {
    return creneauxHoraires.filter((creneauHoraire) => creneauHoraire.jour === day)
  }

  function getCookiesBenevoleID() {
    const decodedToken: any = decodeToken(Cookies.get('token')!)
    const benevoleID: number = decodedToken.id_benevole
    return benevoleID
  }

  function reserver(creneauHoraire: CreneauHoraire, poste: Poste) {
    console.log("Réserver: " + creneauHoraire.jour + " " + creneauHoraire.heureDebut + "h - " + creneauHoraire.heureFin + "h" + " " + poste.nom)
    handleReservation(creneauHoraire, poste, festival!.id, getCookiesBenevoleID())
  }

  async function handleReservation(creneauHoraire: CreneauHoraire, poste: Poste, festival: number, benevole: number) {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/inscriptionBenevole`, {
        benevoleID: benevole,
        festivalID: festival,
        creneauHoraireID: creneauHoraire.id,
        posteID: poste.id,
      })

      if(res.status === 200) {
        const countRes = await axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festival}/count`)
        
        const inscriptionBenevoleTemp: InscriptionBenevole[] = countRes.data.inscription.map((inscription: any) => {
          const nombreMax: any = postes.find((poste) => poste.id === inscription.posteID)?.nombreBenevoles || 1
          const inscriptionBenevole: InscriptionBenevole = {
            creneauHoraireID: inscription.creneauHoraireID,
            posteID: inscription.posteID,
            nombreInscrits: inscription._count.id,
            nombreMax: nombreMax,
          };
          return inscriptionBenevole;
        });
        setInscriptionBenevole(inscriptionBenevoleTemp);
      }

    } catch (error) {
      console.error(error);
    }
  }

  function handleProgressBars(poste: Poste, creneauHoraire: CreneauHoraire) {
    
    const inscriptionBenevoleSpe: InscriptionBenevole | undefined = inscriptionBenevole.find((inscription) => inscription.posteID === poste.id && inscription.creneauHoraireID === creneauHoraire.id)
    if(inscriptionBenevoleSpe === undefined) {
      return 0
    } else {
      const nombreInscrits: number = inscriptionBenevoleSpe.nombreInscrits || 0
      const nombreMax: number = inscriptionBenevoleSpe.nombreMax || 1
      const progress: number = Math.floor((nombreInscrits / nombreMax) * 100)

      return progress
    }
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
        Planning du festival édition {festival?.edition}
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
                        <LinearProgress variant="determinate" value={handleProgressBars(poste, creneauHoraire)} color="warning" />
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