import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AuthContext from "../context/AuthProvider";
import { useContext, useEffect, useState } from "react";
import { NavLink, Navigate} from "react-router-dom";
import Cookies from 'js-cookie';
import {decodeToken} from 'react-jwt';
import axios from 'axios';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Divider, Stack } from '@mui/material';

function ResponsiveAppBar() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState(false);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    Cookies.remove('token');
    Cookies.remove('id_member');
    setIsAuthenticated(false);

    return <Navigate to="/login" />;
  }

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
    <AppBar color='secondary'
     sx={{
      position: 'static',
     }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Stack direction="row" spacing={2} sx={{ flexGrow: 1, backgroundColor: 'transparent' }}>
            <img src="/vectoriel/logo_FDJ_FINAL.jpg" alt="logo" width="80px" height="47px" />
            <NavLink to="/" style={{color: 'inherit'}}>
              <Button 
                color="inherit"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid white',
                  },
                }}
              >
                <Typography variant='h6' sx={{color: 'inherit', fontWeight: 'bold'}} >
                  Accueil
                </Typography>
              </Button>
            </NavLink>
            {isAuthenticated &&
              <NavLink to="/planning" style={{color: 'inherit'}}>
              <Button 
                color="inherit"
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid white',
                  },
                }}
              >
                <Typography variant='h6' sx={{color: 'inherit', fontWeight: 'bold'}} >
                  Planning
                </Typography>
              </Button>
            </NavLink>
            }
            
          </Stack>
          <Divider variant="middle" orientation="vertical" flexItem sx={{mx: 2, border: '1.5px solid white'}} />
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <Button onClick={handleOpenUserMenu} sx={{ color: 'white' }}>
                <AccountCircleIcon 
                  fontSize='large' 
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.1)',
                    },
                  }}
                />
              </Button>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {isAuthenticated ? (
                [
                  <MenuItem key="account" onClick={handleCloseUserMenu}>
                    <NavLink to="/account" style={{color: 'inherit', textDecoration: 'none'}}>
                      <Typography variant='h6' sx={{color: 'inherit', fontWeight: 'bold', textDecoration: 'none'}} >
                        MON COMPTE
                      </Typography>
                    </NavLink>
                  </MenuItem>,
                  isAdmin && (
                    <MenuItem key="dashboard" onClick={handleCloseUserMenu} sx={{ display: 'flex', justifyContent: 'center' }}>
                      <NavLink to="/dashboard" style={{color: 'inherit', textDecoration: 'none'}}>
                        <Typography variant='h6' sx={{color: 'inherit', fontWeight: 'bold', textDecoration: 'none'}} >
                          DASHBOARD
                        </Typography>
                      </NavLink>
                    </MenuItem>),
                  <MenuItem key="logout" onClick={handleLogout} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <NavLink to="/login" style={{color: 'inherit', textDecoration: 'none'}}>
                      <Typography variant='h6' sx={{color: 'inherit', fontWeight: 'bold', textDecoration: 'none'}} >
                        DECONNEXION
                      </Typography>
                    </NavLink>
                  </MenuItem>,
                ]
              ) : (
                [
                  <MenuItem key="login" onClick={handleCloseUserMenu} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <NavLink to="/login" style={{color: 'inherit', textDecoration: 'none'}}>
                      <Typography variant='h6' sx={{color: 'inherit', fontWeight: 'bold', textDecoration: 'none'}} >             
                        CONNNECTION                  
                      </Typography>
                    </NavLink>
                  </MenuItem>,
                  <MenuItem key="register" onClick={handleCloseUserMenu} sx={{ display: 'flex', justifyContent: 'center' }}>
                    <NavLink to="/signup" style={{color: 'inherit', textDecoration: 'none', textAlign: 'center'}}>
                      <Typography variant='h6' sx={{color: 'inherit', fontWeight: 'bold', textDecoration: 'none'}} >
                        INSCRIPTION
                      </Typography>
                    </NavLink>
                  </MenuItem>,
                ]
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;
