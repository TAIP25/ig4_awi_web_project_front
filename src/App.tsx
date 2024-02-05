/* React */
import { Routes, Route } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import Cookies from 'js-cookie';
import {decodeToken} from 'react-jwt';
import axios from 'axios';

/* MUI */
import { Box, ThemeProvider, createTheme } from "@mui/material";

/* Structure */
import Navbar from "./pageStructure/Navbar";

/* Pages */
import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Account from "./pages/account/Account";
import Planning from "./pages/planning/Planning";
import EventSignup from "./pages/events/EventSignup";
import Error from "./pages/error/Error";

/* Context */
import AuthContext from "./context/AuthProvider";

const theme = createTheme({
  palette: {
    primary: {
      main: '#739600',
      light: '#92D400',
      dark: '#55601C',
    },
    secondary: {
      main: '#4C5CC5',
      light: '#9DABE2',
      dark: '#002663',
    },
    background: {
      default: '#1D1E26',
    },
    error: {
      main: '#FF0000',
    },
  }
});



export default function App() {

  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (Cookies.get('token') != null) {
      setIsAuthenticated(true);

      // On récupère l'id du membre dans le token
      const token = Cookies.get('token');

      if (token != null) {
        const decodedToken: any = decodeToken(token);
        const id = decodedToken.id_benevole;
        axios.get(`${import.meta.env.VITE_API_URL}/benevole/${id}`)
        .then((response) => {
          if (response.data.statut === "Admin") {
            setIsAdmin(true);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      }   
    }
  }, [isAuthenticated]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", flex: 1}} component="main">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          { isAdmin && <Route path="/dashboard" element={<Dashboard />} /> }
          <Route path="/account" element={<Account />} />
          <Route path="/planning" element={<Planning />} />
          <Route path="/eventsignup" element={<EventSignup />} />
          <Route path="*" element={<Error />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}