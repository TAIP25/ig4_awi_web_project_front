import { Box, Button, Chip, Divider, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import Item from "./Item";
import CreaneauHoraire from "../../interfaces/CreneauHoraire";
// (local function) getCreneauHoraireByDay(day: string): CreneauHoraire[]
interface AnimationProps {
  getCreneauHoraireByDay: (day: string) => CreaneauHoraire[],
  jour: string
}

export default function Animation({ getCreneauHoraireByDay, jour }: AnimationProps) {

  /* UseState */
  const [open, setOpen] = React.useState(false);

  /* Fake data */
  const espaceSousEspace = {
    "Espace A": [ "Sous-Espace A1", "Sous-Espace A2" ],
    "Espace B": [ "Sous-Espace B1", "Sous-Espace B2" ],
    "Espace C": [ "Sous-Espace C1", "Sous-Espace C2" ]
  }

  return (
    <Paper sx={{
      minHeight: "55px",
      backgroundColor: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}>
      <Stack spacing={2} sx={{ p:2, width: "100%" }}>
        <Stack direction="row" spacing={2} sx={{ 
          display: "flex",
          justifyContent: "center", 
          alignItems: "center",
        }}>
          <Button 
            variant="contained" 
            sx={{ backgroundColor: "primary.main", color: "white", fontWeight: "bold" }}
            onClick={() => setOpen(!open)}
          >
            {open ? "-" : "+"}
          </Button>
          <Typography variant="h6" sx={{ fontWeight: "bold", color: "black" }}>
            Animation
          </Typography>
        </Stack>
        { open && 
          <Stack spacing={2} sx={{ width: "100%" }}>
            {Object.keys(espaceSousEspace).map((espace: string) => (
              <Stack key={espace} spacing={2}>
                <Divider>
                  <Chip label={espace} size="small" color="primary" sx={{ fontWeight: "bold" }} />
                </Divider>
                {(espaceSousEspace as { [key: string]: string[] })[espace].map((sousEspace: string) => (
                  <Stack key={sousEspace} direction="row" spacing={2}>
                    <Item key={sousEspace} color="primary" title={sousEspace} />
                    {getCreneauHoraireByDay(jour).map((creneauHoraire) => {
                      const customStyle = {
                        width: "100%",
                        height: "55px",
                        color: "white",
                        display: "flex", 
                        justifyContent: "center", 
                        alignItems: "center"
                      };
          
                      return ( 
                        <Paper key={creneauHoraire.id} sx={{ ...customStyle }}>
                          <Button 
                            variant="contained" 
                            color="secondary"
                            sx={{ margin: 'auto', width: "100%", height: "100%" }}
                          >
                            <Stack>
                              <Typography variant="h6" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
                                Réserver
                              </Typography>
                              <Box sx={{ width: '100%' }}>
                                <LinearProgress variant="determinate" value={0} color="warning" />
                              </Box>
                            </Stack>
                          </Button>
                        </Paper>
                      );
                    })}
                  </Stack>
                ))}
              </Stack>
            ))}
          </Stack>
        }
      </Stack>
    </Paper>
  );
}