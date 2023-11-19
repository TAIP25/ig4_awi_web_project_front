import { Box, Typography } from "@mui/material";

export default function Planning() {
  return (
    <Box
    component="main"
    sx={{
      backgroundColor: (theme) =>
        theme.palette.mode === 'light'
          ? theme.palette.grey[100]
          : theme.palette.grey[900],
      flexGrow: 1,
      height: '100vh',
      overflow: 'auto',
    }}
    >
      <Typography 
      variant="h1"
      component="div"
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      sx={{
        height: '100%',
        width: '100%',
      }}
      >
        Planning
      </Typography>
    </Box>
  );
}