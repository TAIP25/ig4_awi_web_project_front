import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AuthContext from "../context/AuthProvider";
import { useContext, useEffect } from "react";
import { Navigate} from "react-router-dom";
import Cookies from 'js-cookie';


const pages = ['Accueil', 'Calendrier'];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

const theme = createTheme({
  palette: {
    primary: {
      main: '#888888',
    },
    secondary: {
      main: '#FF0000',
    },
  }
});

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);

  const {isAuthenticated, setIsAuthenticated} = useContext(AuthContext);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
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
          <img src="/vectoriel/logo_FDJ_FINAL.jpg" alt="logo" width="80px" height="47px" />
          <Typography
            variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.2rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Festival du Jeu
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem key="accueil" onClick={handleCloseNavMenu} >
                <Typography 
                  textAlign="center"
                  component="a"
                  href='/'
                >
                  Accueil
                </Typography>
                </MenuItem>
              <MenuItem key="calendrier" onClick={handleCloseNavMenu} >
                <Typography 
                textAlign="center" 
                component="a"
                href='/planning'
                  >
                  Calendrier
                  </Typography>
              </MenuItem>
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Festival du Jeu
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            <Button
                key="accueil"
                href='/'
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Accueil
            </Button>
            <Button
                key="planning"
                href='/planning'
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Calendrier
            </Button>
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="User" src="/user-logo.png" />
              </IconButton>
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
                    <Typography textAlign="center" component="a" href="/account">
                      Account
                    </Typography>
                  </MenuItem>,
                  <MenuItem key="logout" onClick={handleLogout}>
                    <Typography textAlign="center" component="a" href="/login">
                      Logout
                    </Typography>
                  </MenuItem>,
                ]
              ) : (
                [
                  <MenuItem key="login" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" component="a" href="/login">
                      Login
                    </Typography>
                  </MenuItem>,
                  <MenuItem key="register" onClick={handleCloseUserMenu}>
                    <Typography textAlign="center" component="a" href="/signup">
                      Register
                    </Typography>
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
