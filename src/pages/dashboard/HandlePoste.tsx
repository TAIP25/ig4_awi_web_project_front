import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

import Title from "./Title";
import Poste from "../../interfaces/Poste";

// TODO: Finish implementing this page
export default function HandlePoste() {

  /* Constants */
  const FESTIVAL = 3;

  /* UseState */
  const [postes, setPostes] = useState<Poste[]>([]);
  const [open, setOpen] = useState(false);

  /* UseEffect */
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/poste/festival/${FESTIVAL}`)
    .then(response => {
      console.log(response.data.postes)
      setPostes(response.data.postes)
    })
  }, [])

  /* Functions */
  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  async function addPoste(nom: string, description: string, nombreBenevoles: number) {
    await axios.post(`${import.meta.env.VITE_API_URL}/poste/`, {
      nom: nom,
      description: description,
      nombreBenevoles: nombreBenevoles,
      festival: FESTIVAL
    })
    .then(response => {
      console.log(response.data)
      setPostes([...postes, response.data.poste])
    })
  }


  return (
    <Box
    component="main"
    sx={{
      overflow: 'auto',
    }}
    >
      <Title>Poste</Title>
      <Stack spacing={2} sx={{ m: 2 }}>
        {postes.map((poste) => (
          <Button key={poste.id} variant="contained" color="primary" sx={{ m: 1 }}>
            {poste.nom}
          </Button>
        ))}
        <Button variant="outlined" color="primary" sx={{ m: 1 }} onClick={handleOpen}>
          Ajouter un poste
        </Button>
        <Modal
          open={open}
          onClose={handleClose}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 400,
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" component="div">
                Ajouter un poste
              </Typography>
              { ["nom", "description", "nombre de bénévoles nécessaires"].map((label) => (
                <TextField key={label} id="standard-basic" label={label+"*"} color="primary" sx={{ m: 1 }} />
              )) }
              <Stack spacing={2} direction="row" sx={{ m: 1 }}>
                <Button variant="contained" color="primary" sx={{ m: 1 }}>
                  Ajouter
                </Button>
                <Button variant="outlined" color="primary" sx={{ m: 1 }} onClick={handleClose}>
                  Annuler
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Modal>
      </Stack>
    </Box>
  );
}