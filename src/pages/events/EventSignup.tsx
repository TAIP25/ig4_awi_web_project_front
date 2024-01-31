
import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import {decodeToken} from 'react-jwt';
import Cookies from 'js-cookie';
import  Festival  from '../../interfaces/Festival';

const tailleTShirt = [
  {
    value: 'XS',
    label: 'XS',
  },
  {
    value: 'S',
    label: 'S',
  },
  {
    value: 'M',
    label: 'M',
  },
  {
    value: 'L',
    label: 'L',
  },
  {
    value: 'XL',
    label: 'XL',
  },
  {
    value: 'XXL',
    label: 'XXL',
  },
];

const hebergement = [
  {
    value: 'Recherche',
    label: 'Recherche',
  },
  {
    value: 'Proposition',
    label: 'Proposition',
  },
  {
    value: 'Aucun',
    label: 'Aucun',
  },
];

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function EventSignup() {

  const [checked, setChecked] = useState(false);
  const [selectedHebergement, setSelectedHebergement] = useState('');
  const [festival, setFestival] = useState<Festival>();

  useEffect(() => {
    axios.get(`${import.meta.env.VITE_API_URL}/festival/next`).then((response) => {
      console.log("Festival :");
      console.log(response);
      setFestival(response.data);
    }).catch((error) => {
      console.log(error);
    });
  }, []);
  
  const handleChecked = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked((prev) => !prev);
    console.log(checked);
  };

  

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    const data = new FormData(event.currentTarget);

    console.log(data.get('tailleTShirt'));
    console.log(data.get('hebergement'));

    //Get benevole id from the token in the cookies
    
    const token = Cookies.get('token');
    if (token != null) {
      console.log("Token : " + token);
      const decodedToken : any = decodeToken(token);
      const id_benevole = decodedToken.id_benevole;

      // If Hebergement is "Proposition" and adresse is empty
      if (data.get('hebergement') === "Proposition" && data.get('adresse') === "") {
        alert("Vous devez saisir une adresse si vous proposez un hébergement"); 
        return;
      }

       //Add the relation between the festival and the benevole
      axios.post(`${import.meta.env.VITE_API_URL}/festivalBenevole/`, {
        festivalId: festival?.id,
        benevoleId: id_benevole,
      }).then((response) => {
        console.log(response);

        axios.put(`${import.meta.env.VITE_API_URL}/benevole/${id_benevole}`, {
          tailleTShirt: data.get('tailleTShirt'),
          hebergement: data.get('hebergement'),
          adresse: data.get('adresse'),
          telephone: data.get('telephone'),
          vegetarien: checked,
        }).then((response) => {
          console.log(response);
          alert("Inscription réussie");
        }).catch((error) => {
          console.log(error);
          alert(error);
        });

      }).catch((error) => {
        
        console.log(error);
        alert("Vous êtes déjà inscrit à ce festival")
        return;
      });


      
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="sm">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Inscrivez vous au festival édition {festival?.edition}
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  SelectProps={{
                    native: true,
                  }}
                  name="tailleTShirt"
                  label="Taille T-shirt"
                  id="tailleTShirt"
                >
                  {tailleTShirt.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  select
                  SelectProps={{
                    native: true,
                  }}
                  name="hebergement"
                  label="Hebergement"
                  id="hebergement"
                  onChange={(e) => setSelectedHebergement(e.target.value)}
                >
                  {hebergement.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  disabled={selectedHebergement !== "Proposition"}
                  required={selectedHebergement === "Proposition"}
                  fullWidth
                  SelectProps={{
                    native: true,
                  }}
                  name="adresse"
                  label="Adresse"
                  id="adresse"
                >
                </TextField>
              </Grid>
              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  name="telephone"
                  label="Téléphone"
                  id="telephone"
                >
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                  <Checkbox 
                    value="vegetarien" 
                    color="primary"
                    onChange={handleChecked} 
                    checked={checked}
                    />}
                  label="Je suis végétarien"
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              S'inscrire
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/login" variant="body2">
                  Vous avez déjà un compte ? Connectez-vous
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}