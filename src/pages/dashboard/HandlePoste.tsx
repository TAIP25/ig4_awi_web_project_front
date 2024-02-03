import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "axios";

import Title from "./Title";
import Poste from "../../interfaces/Poste";

// TODO: Finish implementing this page

interface HandlePosteProps {
  currentFestival: number;
}

export default function HandlePoste( { currentFestival }: HandlePosteProps ) {

  /* Constants */

  /* UseState */
  const [postes, setPostes] = useState<Poste[]>([]);
  const [open, setOpen] = useState(false);
  const [poste, setPoste] = useState<Poste>({
    id: 0,
    nom: "",
    description: "",
    nombreBenevoles: 0
  });
  const [error, setError] = useState(false);

  /* UseEffect */
  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/poste/festival/${currentFestival}`)
    .then(response => {
      setPostes(response.data.postes)
    })
  }, [currentFestival])

  /* Functions */
  const handleOpen = (_: React.MouseEvent<HTMLButtonElement>, poste?: Poste) => {
    if (poste) {
      setPoste(poste)
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setError(false);
    setPoste({
      id: -1,
      nom: "",
      description: "",
      nombreBenevoles: 0
    })
  };

  function handlePosteChange(e: any) {
    setPoste({
      ...poste,
      [e.target.name]: e.target.value
    })
  }

  async function addPoste(id: number, nom: string, description: string, nombreBenevoles: number) {
    setError(true)
    
    if (nom === "" || description === "" || nombreBenevoles === 0) {
      return
    }
    if(id !== -1) {

      await axios.put(`${import.meta.env.VITE_API_URL}/poste/${id}`, {
        nom: nom,
        description: description,
        nombreBenevoles: nombreBenevoles,
        festivalId: currentFestival
      })
      .then(response => {
        setPostes([...postes.filter((poste) => poste.id !== id), response.data.poste])
      })
    } else {
      await axios.post(`${import.meta.env.VITE_API_URL}/poste`, {
        nom: nom,
        description: description,
        nombreBenevoles: nombreBenevoles,
        festivalId: currentFestival
      })
      .then(response => {
        setPostes([...postes, response.data.poste])
      })
    }

    handleClose()
  }

  async function deletePoste(id: number) {
    await axios.delete(`${import.meta.env.VITE_API_URL}/poste/${id}`)
    .then(() => {
      setPostes([...postes.filter((poste) => poste.id !== id)])
    })

    handleClose()
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
          <Button key={poste.id} variant="contained" color="primary" sx={{ m: 1 }} onClick={(e) => handleOpen(e, poste)}>
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
              { [{label: "nom", name: "nom"}, {label: "description", name: "description"}, {label: "nombre de bénévoles nécessaires", name: "nombreBenevoles"}].map(({label, name}) => (
                <TextField
                  error={
                    error &&
                    (poste[name as keyof Poste] === "" ||
                      (name === "nombreBenevoles" && poste[name as keyof Poste] === 0))
                  }
                  key={label} 
                  id="standard-basic" 
                  label={label+"*"} 
                  color="primary" 
                  sx={{ m: 1 }} 
                  name={name} 
                  type={name === "nombreBenevoles" ? "number" : "text"}
                  value={poste[name as keyof Poste]}
                  onChange={handlePosteChange}
                />
              )) }
              <Stack spacing={2} direction="row" sx={{ m: 1 }}>
                <Button variant="contained" color="primary" sx={{ m: 1 }} onClick={() => addPoste(poste.id, poste.nom, poste.description, poste.nombreBenevoles)}>
                  { poste.id !== -1 ? "Modifier" : "Ajouter" }
                </Button>
                <Button variant="outlined" color="primary" sx={{ m: 1 }} onClick={handleClose}>
                  Annuler
                </Button>
                { poste.id !== -1 &&
                  <Button 
                    variant="contained" 
                    color="error"
                    onClick={() => deletePoste(poste.id)}
                  >
                    Supprimer
                  </Button>
                }
              </Stack>
            </Stack>
          </Box>
        </Modal>
      </Stack>
    </Box>
  );
}