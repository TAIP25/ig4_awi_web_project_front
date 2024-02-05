import { Box, Button, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';

import CreneauHoraire from "../../interfaces/CreneauHoraire";
import Poste from "../../interfaces/Poste";
import Festival from "../../interfaces/Festival";
import { decodeToken } from "react-jwt";
import InscriptionBenevole from "../../interfaces/InscriptionBenevole";
import Item from "./Item";
import MonInscriptionBenevole from "../../interfaces/MonInscriptionBenevole";
import Switch from "./Switch";
import Animation from "./Animation";

// Enum with the different status of an inscription
export enum Status {
  Accepte, // If the inscription is accepted
  AcceptationEffectif, // If the inscription of one post in the same creneauHoraire is accepted
  EnAttente, // If the inscription is waiting for an answer
  Refuse, // If the inscription is refused
  Plein, // If the inscription is full
  NonInscrit, // If the user is not inscribed
}


//TODO: refactor code and file
export default function Planning() {

  /* Variables */
  //TODO: handle week if the festival is not on saturday and sunday
  const week: string[] = ["Samedi", "Dimanche"];

  /* UseState */
  const [festival, setFestival] =  useState<Festival | null>(null);
  const [creneauxHoraires, setCreneauxHoraires] = useState<CreneauHoraire[]>([]);
  const [postes, setPostes] = useState<Poste[]>([]);
  const [inscriptionBenevole, setInscriptionBenevole] = useState<InscriptionBenevole[]>([]);
  const [myInscriptionBenevole, setMyInscriptionBenevole] = useState<MonInscriptionBenevole[]>([]);
  const [jour, setJour] = useState<string>(week[0]);
  const [refreshTrigger, setRefreshTrigger] = useState<boolean>(false);
  const [dataReady, setDataReady] = useState<boolean>(false);
  const [animation, setAnimation] = useState<number|null>(null);
  const [myInscriptionBenevoleAnimation, setMyInscriptionBenevoleAnimation] = useState<MonInscriptionBenevole[]>([]);


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

  /* UseEffect */
  useEffect(() => {
    if(festival){
      const fetchData = async () => {
        try {
          const [res1, res2, res3] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festival?.id}/count`),
            axios.get(`${import.meta.env.VITE_API_URL}/poste/festival/${festival?.id}`),
            axios.get(`${import.meta.env.VITE_API_URL}/creneauHoraire`),
          ]);
    
          const creneauxHoraires: CreneauHoraire[] = res3.data.creneauHoraire;
          const postes: Poste[] = res2.data.postes;
          
          const inscriptionBenevoleTemp: InscriptionBenevole[] = res1.data.inscription.map((inscription: any) => {
            const nombreMax: number = postes.find((poste) => poste.id === inscription.posteID)?.nombreBenevoles || 1
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
          const resAnimation: number = postes.find((poste) => poste.nom === "Animation")!.id;
          setAnimation(resAnimation);

          setInscriptionBenevole(inscriptionBenevoleTemp);
          setDataReady(true);
        } catch (error) {
          console.error(error);
        }
      }
      fetchData();
    };
  }, [festival, animation]);

  // use effect to update progress bars when inscriptionBenevole is updated
  useEffect(() => {
    if(festival){
      const fetchData = async () => {
        try {
          const benevoleID: number = getCookiesBenevoleID();
          const [res1, res2] = await Promise.all([
            axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festival!.id}/count`),
            axios.get(`${import.meta.env.VITE_API_URL}/inscriptionbenevole/festival/${festival!.id}/benevole/${benevoleID}`),
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

          if(postes.length !== 0) {
            setInscriptionBenevole(inscriptionBenevoleTemp);
          }

          const myInscriptionBenevoleTemp: MonInscriptionBenevole[] = res2.data.inscription.map((inscription: any) => {
            const myInscriptionBenevole: MonInscriptionBenevole = {
              id: inscription.id,
              creneauHoraireID: inscription.creneauHoraireID,
              posteID: inscription.posteID,
              status: inscription.status,
            };
            return myInscriptionBenevole;
          });
          setMyInscriptionBenevole(myInscriptionBenevoleTemp);
          setMyInscriptionBenevoleAnimation(myInscriptionBenevoleTemp.filter((inscription) => inscription.posteID === animation));
        } catch (error) {
          console.error(error);
        } finally {
          setRefreshTrigger(false)
        }
      };
      fetchData();
    }
  }, [refreshTrigger, festival, animation]);

  /* Functions */
  function getCreneauHoraireByDay(day: string): CreneauHoraire[] {
    return creneauxHoraires.filter((creneauHoraire) => creneauHoraire.jour === day)
  }

  function getCookiesBenevoleID() {
    const decodedToken: any = decodeToken(Cookies.get('token')!)
    const benevoleID: number = decodedToken.id_benevole
    return benevoleID
  }

  async function reserver(creneauHoraire: CreneauHoraire, poste: Poste) {
    await handleReservation(creneauHoraire, poste, festival!.id, getCookiesBenevoleID())
    setRefreshTrigger(true)
  }

  async function annuler(creneauHoraire: CreneauHoraire, poste: Poste) {
    await handleAnnulation(creneauHoraire, poste, festival!.id, getCookiesBenevoleID())
    setRefreshTrigger(true)
  }

  async function handleReservation(creneauHoraire: CreneauHoraire, poste: Poste, festival: number, benevole: number) {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/inscriptionBenevole`, {
        benevoleID: benevole,
        festivalID: festival,
        creneauHoraireID: creneauHoraire.id,
        posteID: poste.id,
      })
    } catch (error) {
      console.error(error);
    }
  }

  async function handleAnnulation(creneauHoraire: CreneauHoraire, poste: Poste, festival: number, benevole: number) {
    try {
      const deleteInscriptionID = myInscriptionBenevole.find((inscription) => inscription.posteID === poste.id && inscription.creneauHoraireID === creneauHoraire.id)
      await axios.delete(`${import.meta.env.VITE_API_URL}/inscriptionBenevole/${deleteInscriptionID?.id}`, {
        data: {
          benevoleID: benevole,
          festivalID: festival,
          creneauHoraireID: creneauHoraire.id,
          posteID: poste.id,
        }
      })
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

  function handleStatus(poste: Poste, creneauHoraire: CreneauHoraire): Status {
    const inscriptionBenevoleSpe: InscriptionBenevole | undefined = inscriptionBenevole
      .find((inscription) => inscription.posteID === poste.id && inscription.creneauHoraireID === creneauHoraire.id)
    
    const myInscriptionBenevoleSpe: MonInscriptionBenevole | undefined = myInscriptionBenevole
      .find((inscription) => inscription.posteID === poste.id && inscription.creneauHoraireID === creneauHoraire.id)
    
    const myInscriptionBenevoleSpe2: MonInscriptionBenevole | undefined = myInscriptionBenevole
      .filter((inscription) => inscription.posteID !== poste.id && inscription.creneauHoraireID === creneauHoraire.id)
      .find((inscription) => inscription.status === "Accepté")

    if(myInscriptionBenevoleSpe2 !== undefined) {
      return Status.AcceptationEffectif
    }

    if(myInscriptionBenevoleSpe !== undefined) {
      if(myInscriptionBenevoleSpe.status === "Accepté") {
        return Status.Accepte
      } else if(myInscriptionBenevoleSpe.status === "En attente") {
        return Status.EnAttente
      } else if (myInscriptionBenevoleSpe.status === "Refusé") {
        return Status.Refuse
      }
    } else {
      if(inscriptionBenevoleSpe !== undefined) {
        if(inscriptionBenevoleSpe.nombreInscrits === inscriptionBenevoleSpe.nombreMax) {
          return Status.Plein
        } else {
          return Status.NonInscrit
        }
      }
    }
    return Status.NonInscrit
  }

  function handleItem(status: Status, poste: Poste, creneauHoraire: CreneauHoraire) {
    const customStyle = {
      width: "100%",
      height: "55px",
      color: "white",
      display: "flex", 
      justifyContent: "center", 
      alignItems: "center"
    }
    switch(status) {
      case Status.Accepte:
        return (
          <Paper key={creneauHoraire.id} sx={{...customStyle, backgroundColor: `success.main`}}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              ACCEPTÉ
            </Typography>
          </Paper>
        )
      case Status.AcceptationEffectif:
        return (
          <Paper key={creneauHoraire.id} sx={{...customStyle, backgroundColor: `gray`}} />
        )
      case Status.EnAttente:
        return (
          <Paper key={creneauHoraire.id} sx={{...customStyle, backgroundColor: `warning.main`}}>
              <Button
                variant="contained" 
                color="warning"
                sx={{ margin: 'auto', width: "100%", height: "100%" }} 
                onClick={() => {annuler(creneauHoraire, poste)}}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                  EN ATTENTE
                </Typography>
              </Button>
          </Paper>
        )
      case Status.Refuse:
        return (
          <Paper key={creneauHoraire.id} sx={{...customStyle, backgroundColor: `error.main`}}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              REFUSÉ
            </Typography>
          </Paper>
        )
      case Status.Plein:
        return (
          <Paper key={creneauHoraire.id} sx={{...customStyle, backgroundColor: `gray`}}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              PLEIN
            </Typography>
          </Paper>
        )
      case Status.NonInscrit:
        return (
          <Paper key={creneauHoraire.id} sx={{...customStyle, backgroundColor: `secondary.main`}}>
            <Button 
              variant="contained" 
              color="secondary"
              sx={{ margin: 'auto', width: "100%", height: "100%" }} 
              onClick={() => {reserver(creneauHoraire, poste)}}
            >
              <Stack>
                <Typography variant="h6" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                  Réserver
                </Typography>
                <Box sx={{ width: '100%' }}>
                  { dataReady && <LinearProgress variant="determinate" value={handleProgressBars(poste, creneauHoraire)} color="warning" /> }
                </Box>
              </Stack>
            </Button>
          </Paper>
        )
      default:
        return (
          <Paper key={creneauHoraire.id} sx={{ width: "100%", color: "white", backgroundColor: `secondary.main`, display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button 
              variant="contained" 
              color="secondary"
              sx={{ margin: 'auto', width: "100%", height: "100%" }} 
              onClick={() => {reserver(creneauHoraire, poste)}}
            >
              <Stack>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                  Réserver
                </Typography>
                <Box sx={{ width: '100%' }}>
                  { dataReady && <LinearProgress variant="determinate" value={handleProgressBars(poste, creneauHoraire)} color="warning" /> }
                </Box>
              </Stack>
            </Button>
          </Paper>
        )
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
      <Switch week={week} setJour={setJour} jour={jour} />
        <Stack spacing={2} sx={{ marginLeft: '3rem', marginRight: '3rem' }}>
          <Paper sx={{ p:2, marginLeft: '3rem', marginRight: '3rem', backgroundColor: "white" }}>
            <Stack spacing={2}>
            <Stack direction="row" spacing={2} key={0}>
              <Item color="secondary" title={undefined} />
              {getCreneauHoraireByDay(jour)
              .map((creneauHoraire) => (
                <Item key={creneauHoraire.id} color="primary" title={`${creneauHoraire.heureDebut}h - ${creneauHoraire.heureFin}h`} fontColor="white" />
              ))}
            </Stack>
            {postes.map((poste) => (
              <Stack direction="row" spacing={2} key={poste.id}>
                <Item color="primary" title={poste.nom} fontColor="white" />
                {getCreneauHoraireByDay(jour)
                .map((creneauHoraire) => {
                  const status: Status = handleStatus(poste, creneauHoraire)
                  return (
                    handleItem(status, poste, creneauHoraire)
                  )
                })}
              </Stack>
            ))}
            </Stack>
          </Paper>
          { festival && myInscriptionBenevole.find((inscription) => (inscription.status === "Accepté" || inscription.status === "En attente") && inscription.posteID === animation) && myInscriptionBenevoleAnimation.length !== 0 &&
            <Animation getCreneauHoraireByDay={getCreneauHoraireByDay} jour={jour} festival={festival} setRefreshTrigger={setRefreshTrigger} myInscriptionBenevoleAnimation={myInscriptionBenevoleAnimation} />
          }
        </Stack>
    </Box>
  );
}