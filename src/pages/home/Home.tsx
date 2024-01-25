import { Typography } from "@mui/material"
//import "./Home.scss"

export default function Home(){

  return(
    <div>
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
        Accueil
      </Typography>
    </div>
  )
}