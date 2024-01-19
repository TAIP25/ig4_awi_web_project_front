/* React */
import React from "react";
import { Routes, Route } from "react-router-dom";

/* MUI */
import { Box, ThemeProvider, createTheme, styled } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';

/* Structure */
import Header from "./pageStructure/Header"
import Sidebar from "./pageStructure/Sidebar";

/* Pages */
import Home from "./pages/home/Home";
import Login from "./pages/auth/login/Login";
import Signup from "./pages/auth/signup/Signup";
import Dashboard from "./pages/dashboard/Dashboard";
import Account from "./pages/account/Account";
import Planning from "./pages/planning/Planning";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export const drawerWidth: number = 200;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

export const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default function App() {

  /* UseState */
	const [open, setOpen] = React.useState(true);
  const [namePage, _setNamePage] = React.useState("Accueil");
	
	const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <Header namePage={namePage} toggleDrawer={toggleDrawer} open={open} />
        <Sidebar toggleDrawer={toggleDrawer} open={open} />
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