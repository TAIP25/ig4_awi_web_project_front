import "./Signup.scss";



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
import { useState } from "react";
import { Navigate } from "react-router-dom";


// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function SignUp() {

  const [isSignUp, setIsSignUp] = useState(false);
   

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); 

    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });

    console.log(data.get('tailleTShirt'));
    console.log(data.get('hebergement'));

    //Vérification des champs vide
    if(data.get('email') === "" || data.get('password') === "" || 
      data.get('nom') === "" || data.get('prenom') === "" || 
      data.get('pseudo') === "" || data.get('checkPassword') === "")
      {
      alert("Veuillez remplir tout les champs");
      return;
    }

    //Vérification du mot de passe
    if(data.get('password') !== data.get('checkPassword'))
    {
      alert("Les mots de passe ne sont pas identiques");
      return;
    }

    console.log(`${import.meta.env.VITE_API_URL}/benevole/`)
    axios.post(`${import.meta.env.VITE_API_URL}/benevole/`, {
      email: data.get('email'),
      password: data.get('password'),
      nom: data.get('nom'),
      prenom: data.get('prenom'),
      pseudo: data.get('pseudo'),
    }).then((response) => {
      console.log(response);
      alert("Inscription réussie");
      setIsSignUp(true);
    }).catch((error) => {
      console.log(error);
      alert(error);
    });
  };

  if(isSignUp)
  {
    return <Navigate to="/login" />;
  }

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
            Inscrivez-vous
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="prenom"
                  required
                  fullWidth
                  id="firstName"
                  label="Prénom"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="nom"
                  label="Nom"
                  name="nom"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email"
                  name="email"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="pseudo"
                  label="Pseudo"
                  name="pseudo"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  name="checkPassword"
                  label="Confirmer mot de passe"
                  type="password"
                  id="checkPassword"
                />
              </Grid>
              <Grid item xs={12}>   
                <FormControlLabel
                  control={
                  <Checkbox 
                    value="allowExtraEmails" 
                    color="primary"
                     />}
                  required
                  label="J'accepte de recevoir des mails pour m'informer des disponibilités"
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