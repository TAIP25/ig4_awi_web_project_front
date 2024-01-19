import { List, ListItemButton, ListItemIcon, ListItemText, Divider, Toolbar, IconButton, styled, ListSubheader } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import BarChartIcon from '@mui/icons-material/BarChart';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import HomeIcon from '@mui/icons-material/Home';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import DateRangeIcon from '@mui/icons-material/DateRange';
import AssignmentIcon from '@mui/icons-material/Assignment';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import React from "react";
import MuiDrawer from '@mui/material/Drawer';
import  drawerWidth  from "../App";
import AuthContext from "../context/AuthProvider";
import { useContext, useEffect } from "react";
import Cookies from 'js-cookie';


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

interface SidebarProps {
  open: boolean;
  toggleDrawer: () => void;
}

export default function Sidebar({open, toggleDrawer}: SidebarProps) {
  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  
  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('id_member');
    setIsAuthenticated(false);
  }

  useEffect(() => {
    if (Cookies.get('token') != null) {
      setIsAuthenticated(true);
    }

  }, [isAuthenticated]);


  // Contain: Accueil, Profile, Planning, Logout
  const mainListItems = (
    <React.Fragment>
      <ListItemButton href="/">
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Accueil" />
      </ListItemButton>
      <ListItemButton href="/account">
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary="Profile" />
      </ListItemButton>
      <ListItemButton href="/planning">
        <ListItemIcon>
          <DateRangeIcon />
        </ListItemIcon>
        <ListItemText primary="Planning" />
      </ListItemButton>
    </React.Fragment>
  );


  const dashboardListItems = (
    <React.Fragment>
      <ListItemButton href="/dashboard">
        <ListItemIcon>
          <DashboardIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton href="/dashboard/benevoles">
        <ListItemIcon>
          <PeopleIcon />
        </ListItemIcon>
        <ListItemText primary="Benevoles" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <BarChartIcon />
        </ListItemIcon>
        <ListItemText primary="Statistiques" />
      </ListItemButton>
    </React.Fragment>
  );

  const publipostageListItems = (
    <React.Fragment>
      <ListSubheader component="div" inset>
        Publipostage
      </ListSubheader>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Titre 1" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Titre 2" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <AssignmentIcon />
        </ListItemIcon>
        <ListItemText primary="Titre 3" />
      </ListItemButton>
    </React.Fragment>
  );

  const logoutButton = (
    <React.Fragment>
      <ListItemButton onClick={handleLogout}>
        <ListItemIcon>
          <LogoutIcon color="error" />
        </ListItemIcon>
        <ListItemText primary="Déconnexion" />
      </ListItemButton>
    </React.Fragment>
  );

  const loginButton = (
    <React.Fragment>
      <ListItemButton href="/login">
        <ListItemIcon>
          <LoginIcon color="success" />
        </ListItemIcon>
        <ListItemText primary="Connexion" />
      </ListItemButton>
    </React.Fragment>
  );

  const registerButton = (
    <React.Fragment>
      <ListItemButton href="/signup">
        <ListItemIcon>
          <LoginIcon color='primary' />
        </ListItemIcon>
        <ListItemText primary="Inscription" />
      </ListItemButton>
    </React.Fragment>
  );
  
  return (
    <Drawer variant="permanent" open={open}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />
      <List component="nav">
        { 
          isAuthenticated ?
          <>
          {logoutButton}
          <Divider sx={{ my: 1 }} />
          {mainListItems}
          <Divider sx={{ my: 1 }} />
          {dashboardListItems}
          <Divider sx={{ my: 1 }} />
          {publipostageListItems}
          <Divider sx={{ my: 1 }} />
          </>
          :
          <>
          {loginButton}
          {registerButton}
          </>
        }
        
        
      </List>
    </Drawer>
  )
}
