import { Button, Paper, Stack, Typography } from "@mui/material";

interface SwitchProps {
  week: string[];
  setJour: React.Dispatch<React.SetStateAction<string>>;
  jour: string;
  sx?: any;
}

export default function Switch({ week, setJour, jour, sx }: SwitchProps) {
  return (
    <Paper sx={{ p: 2, marginLeft: '3rem', marginRight: '3rem', marginBottom: '1rem', flexGrow: 1, width: "15%", minWidth: "250px", ...sx }}>
      <Stack direction="row" spacing={2}>
        {week.map((day) => (
          <Button key={day} variant="contained" color="secondary" sx={{ width: "100%", height: "100%" }} onClick={() => {setJour(day)}} disabled={jour === day}>
            <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }} display={"flex"} justifyContent={"center"}>
              {day}
            </Typography>
          </Button>
        ))}
      </Stack>
    </Paper>
  );
}