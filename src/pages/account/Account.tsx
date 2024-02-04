import { Box, Button, Typography } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Navigate} from "react-router-dom";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Benevole from "../../interfaces/Benevole";
import Cookies from 'js-cookie';
import axios from 'axios';

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function Account() {
  const [benevole, setBenevole] = useState<Benevole>();
  const [isEditing, setIsEditing] = useState(false);
  const {setIsAuthenticated} = useContext(AuthContext);
  const [isDeleted, setIsDeleted] = useState(false);

  // Modal 
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const id = Cookies.get('id_member');
    axios.get(`${import.meta.env.VITE_API_URL}/benevole/${id}`)
      .then((response) => {
        console.log(response);
        setBenevole(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  

  const handleUpdate = () => {
    // On change la valeur de isEditing
    setIsEditing(!isEditing);

    // La valeur de isEditing correspond à l'état avant le changement
    if (isEditing) {

      // Envoie les données au serveur
      axios.put(`${import.meta.env.VITE_API_URL}/benevole/${benevole?.id}`, benevole)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    }  
  }

  const handleDelete = () => {
    // Supprime le compte du serveur
    axios.delete(`${import.meta.env.VITE_API_URL}/benevole/${benevole?.id}`)
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });

    // Supprime les cookies
    Cookies.remove('id_member');
    Cookies.remove('token');
    setIsAuthenticated(false);
    setIsDeleted(true);
  }

  if (isDeleted) {
    return <Navigate to="/signup" />;
  }



  return (
    <>
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mon compte
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          Nom :
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.nom} 
          value={benevole?.nom}
          onChange={(event) => setBenevole({...benevole!, nom: event.target.value})}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          Prénom :
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.prenom} 
          value={benevole?.prenom}
          onChange={(event) => setBenevole({...benevole!, prenom: event.target.value})}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          Email :
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.email} 
          value={benevole?.email}
          onChange={(event) => setBenevole({...benevole!, email: event.target.value})}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          Mot de passe :
        </Grid>
        <Grid item xs={12} md={8}>
          <TextField 
          type="password" 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.password} 
          value={benevole?.password}/>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button 
          id="updateButton" 
          variant="contained" 
          color="primary" 
          onClick={handleUpdate} >
            {isEditing ? "Valider les modifications" : "Modifier mes informations"}
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Button 
          id="deleteButton" 
          variant="contained" 
          color="error" 
          onClick={handleOpen}>
            Supprimer mon compte
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={style}>
              <h2 id="parent-modal-title">Confirmer la suppression</h2>
              <p id="parent-modal-description">
                Etes vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.
              </p>
              <Button variant="contained" color="error" onClick={handleClose}>
                Annuler
              </Button>
              <Button variant="contained" color="primary" onClick={handleDelete}>
                Confirmer
              </Button>
            </Box>
          </Modal>
        </Grid>
      </Grid>
    </Box>
    </>
    
  );
}
