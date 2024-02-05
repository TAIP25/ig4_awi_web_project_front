import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Typography, Button } from '@mui/material';
import { keyframes } from '@emotion/react';

const moveAnimation = keyframes`
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(calc(100vw - 300px), calc(100vh - 300px));
  }
`;

const Error = () => {
  useEffect(() => {
    const interval = setInterval(() => {
      const errorPaper = document.getElementById('error-paper');
      if (errorPaper) {
        const randomX = Math.random() * (window.innerWidth - 600) + 150;
        const randomY = Math.random() * (window.innerHeight - 600) + 150;
        errorPaper.style.animation = `${moveAnimation} 5s linear`;
        errorPaper.style.transform = `translate(${randomX}px, ${randomY}px)`;
      }
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Paper
      id="error-paper"
      elevation={3}
      sx={{
        padding: '20px',
        textAlign: 'center',
        margin: 'auto',
        marginTop: '20px',
        width: 'fit-content',
        backgroundColor: 'secondary.main',
        position: 'fixed',
      }}
    >
      <Typography variant="h1" sx={{ marginBottom: '20px', color: 'white' }}>
        ERROR 404
      </Typography>
      <Button variant="contained" component={Link} to="/" color="primary">
        Go to Home
      </Button>
    </Paper>
  );
};

export default Error;