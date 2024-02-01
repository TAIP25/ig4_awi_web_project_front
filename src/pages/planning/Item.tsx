import { Paper, Typography } from "@mui/material";


export default function Item({ color, title, fontColor }: { color: string, title: string | undefined, fontColor?: string }) {
  return (
    <Paper
      sx={{ 
        width: "100%", 
        height: "55px",
        color: fontColor ? fontColor : "white", 
        backgroundColor: `${color}.main`, 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center",
        minWidth: "150px"
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {title}
      </Typography>
    </Paper>
  );
}