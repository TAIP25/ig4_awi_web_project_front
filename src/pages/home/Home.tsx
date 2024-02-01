import { Box, Paper, Stack, Typography } from "@mui/material"

import Switch from "../planning/Switch"
import React from "react"
//import "./Home.scss"

const NEWS = [
  {
    id: 1,
    title: "News 1",
    content: "Content 1"
  },
  {
    id: 2,
    title: "News 2",
    content: "Content 2"
  }
]

const EVENTS = [
  {
    id: 1,
    title: "Event 1",
    content: "Content 1"
  },
  {
    id: 2,
    title: "Event 2",
    content: "Content 2"
  }
]

const REFERENTS = [
  {
    id: 1,
    title: "Referent 1",
    content: "email@example.com"
  },
  {
    id: 2,
    title: "Referent 2",
    content: "email@example.com"
  }
]

const PLANNING = [
  {
    id: 1,
    title: "8h - 9h",
    content: "Content 1"
  },
  {
    id: 2,
    title: "9h - 10h",
    content: "Content 2"
  }
]


export default function Home(){
  /* Variables */
  //TODO: handle week if the festival is not on saturday and sunday
  //Refactor with planning component
  const week: string[] = ["Samedi", "Dimanche"];

  const [jour, setJour] = React.useState(week[0]);

  return(
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
          p: 2,
          fontWeight: "bold",
          fontSize: "4rem",
        }}
      >
        Accueil
      </Typography>
      <Stack spacing={10} direction="row" sx={{ p: 10, marginLeft: '3rem', marginRight: '3rem' }}>
        <Stack spacing={2} sx={{ width: "100%" }}>
          <Paper sx={{ p: 2, borderColor: "secondary.main", borderWidth: "2px", borderStyle: "solid" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              Planning
            </Typography>
            <Switch week={week} setJour={setJour} jour={jour} sx={{ alignSelf: "flex-start" }} />
            <Stack spacing={2} direction="row">
              {PLANNING.map((planning) => (
                <Paper key={planning.id} sx={{ p: 2, borderColor: "primary.main", borderWidth: "2px", borderStyle: "solid" }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                    {planning.title}
                  </Typography>
                  <Typography variant="body1" component="div" display={"flex"} justifyContent={"center"}>
                    {planning.content}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
          <Paper sx={{ p: 2, borderColor: "secondary.main", borderWidth: "2px", borderStyle: "solid" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              Reference
            </Typography>
            <Stack spacing={2}>
              {REFERENTS.map((referent) => (
                <Paper key={referent.id} sx={{ p: 2, borderColor: "primary.main", borderWidth: "2px", borderStyle: "solid" }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                    {referent.title}
                  </Typography>
                  <Typography variant="body1" component="div" display={"flex"} justifyContent={"center"}>
                    {referent.content}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Stack>
        <Stack spacing={2} sx={{ width: "35%" }}>
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              News
            </Typography>
            <Stack spacing={2}>
              {NEWS.map((news) => (
                <Paper key={news.id} sx={{ p: 2, backgroundColor: "primary.main" }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                    {news.title}
                  </Typography>
                  <Typography variant="body1" component="div" display={"flex"} justifyContent={"center"}>
                    {news.content}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
          <Paper sx={{ p: 2, backgroundColor: "secondary.main" }}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              Soirée
            </Typography>
            <Stack spacing={2}>
              {EVENTS.map((event) => (
                <Paper key={event.id} sx={{ p: 2, backgroundColor: "primary.main" }}>
                  <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                    {event.title}
                  </Typography>
                  <Typography variant="body1" component="div" display={"flex"} justifyContent={"center"}>
                    {event.content}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Stack>
      </Stack>
    </Box>
  )
}