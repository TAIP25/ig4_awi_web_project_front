  import { Fragment, useEffect, useState } from 'react';
  import axios from 'axios';
  import Festival from "../../interfaces/Festival";
  import CreneauHoraire from "../../interfaces/CreneauHoraire";
  import {
    Box,
    Button,
    Paper,
    Stack,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    TableContainer, 
    Table, 
    TableHead, 
    TableRow, 
    TableCell, 
    TableBody, 
    TablePagination, 
    Container
  } from '@mui/material';


  export default function ReservationBenevoles(){

      const [reservationBenevoles, setReservationBenevoles] = useState<Array<any>>([]);
      const [reservationToDisplay, setReservationToDisplay] = useState<Array<any>>([]); 
      const [festival, setFestival] = useState<Festival | null>(null);
      const [selectedDay, setSelectedDay] = useState<string>('Samedi');
      const [creneauxHoraires, setCreneauxHoraires] = useState<CreneauHoraire[]>([]);
      const [selectedCreneau, setSelectedCreneau] = useState<number | null>(null); // Nouvelle state pour le créneau sélectionné

      /* UseState */
      const [page, setPage] = useState(0);
      const [rowsPerPage, setRowsPerPage] = useState(10);

      const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
      };

      const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
      };


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

    useEffect(() => {
      const fetchData = async () => {
        try {
          // Récupère les demandes de réservation de bénévoles pour le festival
          await fetchReservationData();
    
          // Récupère tous les créneaux horaires
          await fetchCreneauxHoraires();
    
          console.log("Créneaux horaires : " + creneauxHoraires.length);
    
          // Sélectionner le premier créneau horaire du jour actuel
          const creneauxJourActuel = getCreneauHoraireByDay(selectedDay);
          if (creneauxJourActuel.length > 0) {
            const premierCreneauJourActuel = creneauxJourActuel[0];
            setSelectedCreneau(premierCreneauJourActuel.id);
            setReservationToDisplay(reservationBenevoles.filter((reservationBenevole) => reservationBenevole.creneauHoraire.id === premierCreneauJourActuel.id));
          } else {
            console.log("Pas de créneau pour le jour actuel");
            // S'il n'y a pas de créneau pour le jour actuel, réinitialiser la sélection
            setSelectedCreneau(null);
            setReservationToDisplay([]);
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    }, [festival]);
    

    useEffect(() => {
      if(creneauxHoraires.length > 0){
        setReservationToDisplay(reservationBenevoles.filter((reservationBenevole) => reservationBenevole.creneauHoraire.id === selectedCreneau))
      }
    }
    , [reservationBenevoles, creneauxHoraires])

    // Fonction pour récupérer les données de réservation
    const fetchReservationData = () => {
      axios.get(`${import.meta.env.VITE_API_URL}/inscriptionBenevole/festival/${festival?.id}/reservations`)
        .then(response => {
          setReservationBenevoles(response.data.inscriptions.filter((inscription: any) => inscription.status === null && inscription.festivalID === festival!.id))
        })
        .catch(error => {
          console.error(error);
        });
    };

    // Fonction pour récupérer les créneaux horaires
    const fetchCreneauxHoraires = () => {
      axios.get(`${import.meta.env.VITE_API_URL}/creneauHoraire/`)
        .then(response => {
          setCreneauxHoraires(response.data.creneauHoraire)
        })
        .catch(error => {
          console.error(error);
        });
    };


    const handleDayChange = (event: any) => {
      const newSelectedDay = event.target.value;
      setSelectedDay(newSelectedDay);

      // Sélectionner le premier créneau horaire du nouveau jour
      const creneauxJour = getCreneauHoraireByDay(newSelectedDay);
      if (creneauxJour.length > 0) {
        const premierCreneau = creneauxJour[0];
        setSelectedCreneau(premierCreneau.id);
        setReservationToDisplay(reservationBenevoles.filter((reservationBenevole) => reservationBenevole.creneauHoraire.id === premierCreneau.id));
      } else {
        // S'il n'y a pas de créneau pour le nouveau jour, réinitialiser la sélection
        setSelectedCreneau(null);
        setReservationToDisplay([]);
      }
    }

    /* Functions */
    function getCreneauHoraireByDay(day: string) {
      return creneauxHoraires.filter((creneauHoraire) => creneauHoraire.jour === day)
    }

    const handleCreneauReservationByHoraireandDay = (creneauHoraire: CreneauHoraire) => {
      // Change la couleur du bouton cliqué
      setSelectedCreneau(creneauHoraire.id);
      setReservationToDisplay(reservationBenevoles.filter((reservationBenevole) => reservationBenevole.creneauHoraire.id === creneauHoraire.id))
    }

    const handleRefuseReservation = (reservationBenevole: any) => {
      axios.put(`${import.meta.env.VITE_API_URL}/inscriptionBenevole/${reservationBenevole.id}`, {
        id: reservationBenevole.id,
        status: false
      })
      .then(response => {
        console.log(response.data)
        fetchReservationData();
      })
    }

    // Fonction pour accepter une réservation de bénévole
    // Refuse automatiquement les autres réservations du bénévole pour le même créneau horaire et le même jour
    const handleAcceptReservation = (reservationBenevole: any) => {
      // Accepter la réservation
      axios.put(`${import.meta.env.VITE_API_URL}/inscriptionBenevole/${reservationBenevole.id}`, {
        id: reservationBenevole.id,
        status: true
      })
      .then(response => {
        console.log(response.data)

        // Récupère les autres réservations du bénévole pour le même créneau horaire et le même jour
        const reservationsBenevole = getReservationByCreneauBenevoleFestival(reservationBenevole);
        // Pour chaque réservation, la refuser
        reservationsBenevole.forEach((reservationBenevole) => {
          handleRefuseReservation(reservationBenevole);
        }
        )

        fetchReservationData();
      })

      // Refuser les autres réservations du bénévole pour le même créneau horaire et le même jour
    }

    function getReservationByCreneauBenevoleFestival(reservationBenevole: any) {
      return reservationBenevoles.filter((reservation) => reservation.benevole.id === reservationBenevole.benevole.id && reservation.creneauHoraire.id === reservationBenevole.creneauHoraire.id && reservation.festivalID === reservationBenevole.festivalID)
    }

      return (
          <Box>
            <Typography variant="h4" component="h1" gutterBottom>
              Réservation des bénévoles
            </Typography>
            <FormControl 
              sx={{ m: 1, minWidth: 120 }} 
              variant="standard"
            >
              <InputLabel id="day-label">Jour</InputLabel>
              <Select labelId="day-label" id="day-select" value={selectedDay} onChange={handleDayChange}>
                <MenuItem value="Samedi">Samedi</MenuItem>
                <MenuItem value="Dimanche">Dimanche</MenuItem>
              </Select>
            </FormControl> 
            <Stack sx={{
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              width: '100%',
              height: '600px',
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              m: 1,
            
            }}>
              <Stack sx={{width: "25%"}} direction="column" spacing={2} key={0}>
                <Paper sx={{ margin: 'auto', flexGrow: 1, width: "100%", backgroundColor: "secondary.main" , color: "white"}}>Horaires de réservation</Paper>
                {getCreneauHoraireByDay(selectedDay)
                .map((creneauHoraire) => (
                  <Paper key={creneauHoraire.id} 
                  sx={{ 
                    margin: 'auto', 
                    flexGrow: 1, 
                    width: "100%", 
                    color: "white", 
                    backgroundColor: selectedCreneau === creneauHoraire.id ? "primary.dark" : "primary.main" // Utiliser une couleur plus foncée si le créneau est sélectionné
                  }}>
                    <Button sx={{ 
                      fontWeight: "bold", 
                      color: "white",
                      width: "100%",
                      }}
                      onClick={() => handleCreneauReservationByHoraireandDay(creneauHoraire)}
                      >
                      {creneauHoraire.heureDebut}h - {creneauHoraire.heureFin}h
                    </Button>
                  </Paper>
                  ))}
              </Stack>
              <Container
              sx={{
                display: 'flex',
                flexDirection: 'column',
                flexWrap: 'nowrap',
                width: '100%',
                height: '100%',
                m: 1,
                }}
               >
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Nom</TableCell>
                      <TableCell>Prénom</TableCell>
                      <TableCell>Poste</TableCell>
                      <TableCell>Refuser</TableCell>
                      <TableCell>Accepter</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reservationToDisplay.length > 0 ? ( 
                      reservationToDisplay.map((reservationBenevole: any) => (
                        <TableRow key={reservationBenevole.id}>
                          <TableCell>{reservationBenevole.benevole.nom}</TableCell>
                          <TableCell>{reservationBenevole.benevole.prenom}</TableCell>
                          <TableCell>{reservationBenevole.poste.nom}</TableCell>
                          <TableCell>
                            <Button variant="contained" color="error" onClick={ () => handleRefuseReservation(reservationBenevole)} >
                              Refuser
                            </Button>
                          </TableCell>
                          <TableCell>
                            <Button variant="contained" color="primary" onClick={ () => handleAcceptReservation(reservationBenevole)}>
                              Accepter
                            </Button>
                          </TableCell>
                        </TableRow>
                      )) 
                    ) : (            
                      <TableCell>Aucune réservation de bénévole</TableCell>              
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                component={TableContainer}
                count={reservationToDisplay.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Lignes par page"
                labelDisplayedRows={({ from, to, count }) => `${from}-${to} sur ${count !== -1 ? count : `plus de ${to}`}`}
              />
              </Container>
            </Stack> 
          </Box>                
      );
  }