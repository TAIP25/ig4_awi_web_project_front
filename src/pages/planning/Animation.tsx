import { Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";
import React, { useEffect } from "react";
import Item from "./Item";
import CreaneauHoraire from "../../interfaces/CreneauHoraire";
import axios from "axios";
import Festival from "../../interfaces/Festival";
import EspaceJeu from "../../interfaces/EspaceJeu";
import Jeu from "../../interfaces/Jeu";
import SousEspaceJeu from "../../interfaces/SousEspaceJeu";
import MonInscriptionBenevole from "../../interfaces/MonInscriptionBenevole";
import CreneauHoraire from "../../interfaces/CreneauHoraire";
// (local function) getCreneauHoraireByDay(day: string): CreneauHoraire[]
// Enum with the different status of an inscription
export enum Status {
  Accepte, // If the inscription is accepted
  AcceptationEffectif, // If the inscription of one post in the same creneauHoraire is accepted
  EnAttente, // If the inscription is waiting for an answer
  Refuse, // If the inscription is refused
  Plein, // If the inscription is full
  NonInscrit, // If the user is not inscribed
}


interface AnimationProps {
  getCreneauHoraireByDay: (day: string) => CreaneauHoraire[],
  jour: string,
  festival: Festival,
  setRefreshTrigger: React.Dispatch<React.SetStateAction<boolean>>,
  myInscriptionBenevoleAnimation: MonInscriptionBenevole[]
}

export default function Animation({ getCreneauHoraireByDay, jour, festival, setRefreshTrigger, myInscriptionBenevoleAnimation }: AnimationProps) {

  /* UseState */
  const [open, setOpen] = React.useState<boolean>(false);
  const [espaceJeu, setEspaceJeu] = React.useState<EspaceJeu[]>([]);
  const [myInscriptionSousEspaceJeu, setMyInscriptionSousEspaceJeu] = React.useState<any[]>([]);
  const [refreshTriggerBis, setRefreshTriggerBis] = React.useState<boolean>(false);

  /* UseEffect */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [res1, res2] = await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/jeuSousEspaceFestival/${festival.id}`),
          axios.get(`${import.meta.env.VITE_API_URL}/espaceJeu/festival/${festival.id}`)
        ])

        // Get all game for each sub-space and get all sub-space for each space
        const jeuBySousEspace: { [key: number]: number[] } = {};
        const sousEspaceByEspace: { [key: number]: number[] } = {};
        for (const element of res1.data) {
          if (!jeuBySousEspace[element.sousEspaceDeJeuID]) {
            jeuBySousEspace[element.sousEspaceDeJeuID] = [];
          }
          jeuBySousEspace[element.sousEspaceDeJeuID].push(element.jeuID);

          if(!sousEspaceByEspace[element.sousEspaceDeJeu.espaceDeJeuID]) {
            sousEspaceByEspace[element.sousEspaceDeJeu.espaceDeJeuID] = [];
          }
          sousEspaceByEspace[element.sousEspaceDeJeu.espaceDeJeuID].push(element.sousEspaceDeJeuID);
        }

        let jeuTemp: Jeu[] = res1.data.map((element: any) => {
          const jeu = element.jeu;
          return new Jeu(
            jeu.id,
            jeu.nom,
            jeu.aAnimer,
            new Date(jeu.createdAt),
            new Date(jeu.updatedAt)
          );
        });

        // Remove duplicate
        jeuTemp = jeuTemp.filter((jeu, index, self) =>
          index === self.findIndex((t) => (
            t.id === jeu.id
          ))
        );

        let sousEspaceJeuTemp: SousEspaceJeu[] = res1.data.map((element: any) => {
          const sousEspace = element.sousEspaceDeJeu;
          const jeuIds = jeuBySousEspace[sousEspace.id] || [];

          return new SousEspaceJeu(
            sousEspace.id,
            sousEspace.nom,
            sousEspace.description,
            sousEspace.espaceJeuID,
            jeuTemp.filter((jeu) => jeuIds.includes(jeu.id)),
            new Date(sousEspace.createdAt),
            new Date(sousEspace.updatedAt)
          );
        });

        // Remove duplicate
        sousEspaceJeuTemp = sousEspaceJeuTemp.filter((sousEspace, index, self) =>
          index === self.findIndex((t) => (
            t.id === sousEspace.id
          ))
        );

        const espaceJeuTemp: EspaceJeu[] = res2.data.map((espace: any) => {
          const sousEspaceIds = sousEspaceByEspace[espace.id] || [];
          return new EspaceJeu(
            espace.id,
            espace.nom,
            espace.description,
            espace.festivalID,
            sousEspaceJeuTemp.filter((sousEspace) => sousEspaceIds.includes(sousEspace.id)),
            new Date(espace.createdAt),
            new Date(espace.updatedAt)
          );
        });

        setEspaceJeu(espaceJeuTemp);

        try {
          while(myInscriptionBenevoleAnimation.length === 0) {
            if(myInscriptionBenevoleAnimation.length === 0) {
              await new Promise(resolve => setTimeout(resolve, 1000));
              console.log("Waiting for myInscriptionBenevoleAnimation")
              console.log(myInscriptionBenevoleAnimation)
            } else {
              const myInscriptionSousEspaceJeuTemp: any[] = [];
              for(const inscription of myInscriptionBenevoleAnimation) {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/inscriptionBenevole/${inscription.id}`);
                for(const element of res.data.inscription.InscriptionBenevoleSousEspaceDeJeu) {
                  myInscriptionSousEspaceJeuTemp.push({ ...element, creneauHoraireID: res.data.inscription.creneauHoraireID });
                }
              }
              setMyInscriptionSousEspaceJeu(myInscriptionSousEspaceJeuTemp);
              console.log(myInscriptionSousEspaceJeuTemp);
            }
          }
        } catch (error) {
          console.error(error);
        }

      } catch (error) {
        console.error(error);
      }
    }
    fetchData();
  }, []);

  // Handle myInscriptionSousEspaceJeu
  useEffect(() => {
    const fetchData = async () => {
      try {
        const myInscriptionSousEspaceJeuTemp: any[] = [];
        for(const inscription of myInscriptionBenevoleAnimation) {
          const res = await axios.get(`${import.meta.env.VITE_API_URL}/inscriptionBenevole/${inscription.id}`);
          for(const element of res.data.inscription.InscriptionBenevoleSousEspaceDeJeu) {
            myInscriptionSousEspaceJeuTemp.push({ ...element, creneauHoraireID: res.data.inscription.creneauHoraireID });
          }
        }
        setMyInscriptionSousEspaceJeu(myInscriptionSousEspaceJeuTemp);
      } catch (error) {
        console.error(error);
      } finally {
        setRefreshTriggerBis(false)
      }
    }
    fetchData();
  }, [refreshTriggerBis, myInscriptionBenevoleAnimation]);


  /* Function */
  async function reserver(sousEspace: SousEspaceJeu, creneauHoraire: CreaneauHoraire) {
    await handleReservation(sousEspace, creneauHoraire)
    setRefreshTrigger(true)
    setRefreshTriggerBis(true)
  }

  async function handleReservation(sousEspace: SousEspaceJeu, creneauHoraire: CreaneauHoraire) {
    const findInscription: MonInscriptionBenevole | undefined = myInscriptionBenevoleAnimation.find((inscription) => inscription.creneauHoraireID === creneauHoraire.id) || undefined
    if(findInscription) {
      try {
        await axios.post(`${import.meta.env.VITE_API_URL}/inscriptionBenevoleSousEspaceDeJeu`, {
          inscriptionBenevoleID: findInscription?.id,
          sousEspaceJeuID: sousEspace.id
        })
        setRefreshTrigger(true)
      } catch (error) {
        console.error(error)
      }
    }
  }

  async function annuler(sousEspace: SousEspaceJeu, creneauHoraire: CreaneauHoraire) {
    await handleAnnulation(sousEspace, creneauHoraire)
    setRefreshTrigger(true)
    setRefreshTriggerBis(true)
  }

  async function handleAnnulation(sousEspace: SousEspaceJeu, creneauHoraire: CreaneauHoraire) {
    const inscription = myInscriptionSousEspaceJeu.find((inscription) => inscription.sousEspaceDeJeuID === sousEspace.id && inscription.creneauHoraireID === creneauHoraire.id)
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/inscriptionBenevoleSousEspaceDeJeu/${inscription.id}`)
      setRefreshTrigger(true)
    } catch (error) {
      console.error(error)
    }
  }

  function handleStatus(sousEspace: SousEspaceJeu, creneauHoraire: CreaneauHoraire): Status {

    if(myInscriptionSousEspaceJeu.length === 0) {
      return myInscriptionBenevoleAnimation.find((inscription) => inscription.creneauHoraireID === creneauHoraire.id) ? Status.NonInscrit : Status.Refuse
    }

    const myInscriptionBenevoleSpe: any | undefined = myInscriptionSousEspaceJeu
      .find((inscription) => inscription.sousEspaceDeJeuID === sousEspace.id && inscription.creneauHoraireID === creneauHoraire.id)

    const myInscriptionBenevoleSpe2: any | undefined = myInscriptionSousEspaceJeu
      .filter((inscription) => inscription.sousEspaceDeJeuID === sousEspace.id && inscription.creneauHoraireID === creneauHoraire.id)
      .find((inscription: { status: string; }) => inscription.status === "Accepté")

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
      /*
      if(inscriptionBenevoleSpe !== undefined) {
        if(inscriptionBenevoleSpe.nombreInscrits === inscriptionBenevoleSpe.nombreMax) {
          return Status.Plein
        } else {
          return Status.NonInscrit
        }
      }
      */
      return myInscriptionBenevoleAnimation.find((inscription) => inscription.creneauHoraireID === creneauHoraire.id) ? Status.NonInscrit : Status.Refuse
    }
    return Status.NonInscrit
  }

  function handleItem(status: Status, sousEspace: SousEspaceJeu, creneauHoraire: CreneauHoraire) {
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
                onClick={() => {annuler(sousEspace, creneauHoraire)}}
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
              onClick={() => {reserver(sousEspace, creneauHoraire)}}
            >
              <Stack>
                <Typography variant="h6" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                  Réserver
                </Typography>
                <Box sx={{ width: '100%' }}>
                  { /* dataReady && <LinearProgress variant="determinate" value={handleProgressBars(poste, creneauHoraire)} color="warning" /> */ }
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
              onClick={() => {reserver(sousEspace, creneauHoraire)}}
            >
              <Stack>
                <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                  Réserver
                </Typography>
                <Box sx={{ width: '100%' }}>
                  { /* dataReady && <LinearProgress variant="determinate" value={handleProgressBars(poste, creneauHoraire)} color="warning" /> */ }
                </Box>
              </Stack>
            </Button>
          </Paper>
        )
    }
  }

  return (
    <Paper sx={{
      minHeight: "55px",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Stack spacing={2} sx={{ p:2, width: "100%" }}>
        <Stack direction="row" spacing={2} sx={{ 
          display: "flex",
          justifyContent: "center", 
          alignItems: "center",
        }}>
          { myInscriptionBenevoleAnimation.length !== 0 &&
            <Button 
              variant="contained" 
              sx={{ backgroundColor: "primary.main", color: "white", fontWeight: "bold" }}
              onClick={() => setOpen(!open)}
            >
              {open ? "-" : "+"}
            </Button>
          }
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
            Animation
          </Typography>
        </Stack>
        { open &&
          <Stack spacing={2} sx={{ width: "100%" }}>
            {espaceJeu.map((espace: EspaceJeu) => (
              <Stack key={espace.id} spacing={2}>
                <Divider>
                  <Chip label={espace.nom} size="small" color="primary" sx={{ fontWeight: "bold" }} />
                </Divider>
                {espace.sousEspaceJeux.map((sousEspace: SousEspaceJeu) => (
                  <Stack key={sousEspace.id} direction="row" spacing={2}>
                    <Item key={sousEspace.id} color="primary" title={sousEspace.nom} />
                    {getCreneauHoraireByDay(jour).map((creneauHoraire) => {
                      const status: Status = handleStatus(sousEspace, creneauHoraire);
                      return ( 
                        handleItem(status, sousEspace, creneauHoraire)
                      );
                    })}
                  </Stack>
                ))}
              </Stack>
            ))}
          </Stack>
        }
      </Stack>
    </Paper>
  );
}