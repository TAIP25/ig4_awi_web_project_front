/* React */
import React from "react";
import { Routes, Route } from "react-router-dom";

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
import { Palette } from "@mui/icons-material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

const theme = createTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
  }
});



export default function App() {


  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh", flex: 1}} component="main">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/account" element={<Account />} />
          <Route path="/planning" element={<Planning />} />
        </Routes>
      </Box>
    </ThemeProvider>
  );
}