import { Box, Button, Typography, Paper } from "@mui/material";
import { useEffect, useState, useContext } from "react";
import AuthContext from "../../context/AuthProvider";
import { Navigate} from "react-router-dom";
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Modal from '@mui/material/Modal';
import Benevole from "../../interfaces/Benevole";
import Cookies from 'js-cookie';
import axios from 'axios';
import { tailleTShirt, hebergement } from "../../interfaces/Enums";

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

const styleLabel = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-start',
};

const styleButton = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
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
    <Paper 
     sx={{
      margin: 'auto',
      p: 2,
      display: 'flex',
      flexDirection: 'column',
      width: 750,
     }}
    >
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Mon compte
      </Typography>
      <Grid container spacing={2}>
        <Grid 
        sx={styleLabel}
         item xs={12} md={2}>
          Pseudo :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.pseudo} 
          value={benevole?.pseudo}
          onChange={(event) => setBenevole({...benevole!, pseudo: event.target.value})}
          />
        </Grid>
        <Grid sx={styleLabel} item xs={12} md={2}>
          Taille T-Shirt :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            required
            disabled={!isEditing}
            onChange={(event) => setBenevole({...benevole!, tailleTShirt: event.target.value})}
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
            name="tailleTShirt"
            id="tailleTShirt"
          >
            <option selected key={benevole?.tailleTShirt} value={benevole?.tailleTShirt}>
              {benevole?.tailleTShirt}
            </option>
            {tailleTShirt.filter((option) => option.value !== benevole?.tailleTShirt).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>
        <Grid sx={styleLabel} item xs={12} md={2}>
          Nom :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.nom} 
          value={benevole?.nom}
          onChange={(event) => setBenevole({...benevole!, nom: event.target.value})}
          />
        </Grid>
        <Grid sx={styleLabel} item xs={12} md={2}>
          Hébergement :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField
            required
            disabled={!isEditing}
            onChange={(event) => setBenevole({...benevole!, hebergement: event.target.value})}
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
            name="hebergement"
            id="hebergement"
          >
            <option selected key={benevole?.hebergement} value={benevole?.hebergement}>
              {benevole?.hebergement}
            </option>
            {hebergement.filter((option) => option.value !== benevole?.hebergement).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </TextField>
        </Grid>

        <Grid sx={styleLabel} item xs={12} md={2}>
          Prénom :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.prenom} 
          value={benevole?.prenom}
          onChange={(event) => setBenevole({...benevole!, prenom: event.target.value})}
          />
        </Grid>
        <Grid sx={styleLabel} item xs={12} md={2}>
          Adresse :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.adresse} 
          value={benevole?.adresse}
          onChange={(event) => setBenevole({...benevole!, adresse: event.target.value})}
          />
        </Grid>

        <Grid sx={styleLabel} item xs={12} md={2}>
          Email :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.email} 
          value={benevole?.email}
          onChange={(event) => setBenevole({...benevole!, email: event.target.value})}
          />
        </Grid>
        <Grid sx={styleLabel} item xs={12} md={2}>
          Végétarien :
        </Grid>
        <Grid item xs={12} md={4}>
        <TextField
            required
            disabled={!isEditing}
            onChange={(event) => setBenevole({...benevole!, vegetarien: event.target.value === "Oui" ? true : false})}
            fullWidth
            select
            SelectProps={{
              native: true,
            }}
            name="vegetarien"
            id="vegetarien"
          >
            <option selected key={benevole?.vegetarien ? "Oui" : "Non"} value={benevole?.vegetarien ? "Oui" : "Non" }>
              {benevole?.vegetarien ? "Oui" : "Non"}
            </option>
            <option key={benevole?.vegetarien ? "Non" : "Oui"} value={benevole?.vegetarien ? "Non" : "Oui"} >
              {benevole?.vegetarien ? "Non" : "Oui"}
            </option>
          </TextField>
        </Grid>


        <Grid sx={styleLabel} item xs={12} md={2}>
          Mot de passe :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField 
          type="password" 
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.password} 
          value={benevole?.password}/>
        </Grid>
        <Grid sx={styleLabel} item xs={12} md={2}>
          Téléphone :
        </Grid>
        <Grid item xs={12} md={4}>
          <TextField  
          id="outlined-basic" 
          variant="outlined" 
          disabled={!isEditing} 
          placeholder={benevole?.telephone} 
          value={benevole?.telephone}/>
        </Grid>

        <Grid sx={styleButton} item xs={12} md={6}>
          <Button 
          id="updateButton" 
          variant="contained" 
          color="primary" 
          onClick={handleUpdate} >
            {isEditing ? "Valider les modifications" : "Modifier mes informations"}
          </Button>
        </Grid>
        <Grid sx={styleButton} item xs={12} md={6}>
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
    </Paper>
    
  );
}
