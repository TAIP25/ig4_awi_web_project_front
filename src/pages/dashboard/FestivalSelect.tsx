import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import Festival from '../../interfaces/Festival';

interface SelectProps {
  currentFestival: number;
  setCurrentFestival: React.Dispatch<React.SetStateAction<number>>;
  allFestivals: Festival[];
}

export default function FestivalSelect({currentFestival, setCurrentFestival, allFestivals}: SelectProps) {

  const handleChange = (event: SelectChangeEvent) => {
    setCurrentFestival(parseInt(event.target.value));
  };

  return (
    <FormControl sx={{ minWidth: 150 }} size="small">
      <InputLabel id="select-label">Festival actuel</InputLabel>
      <Select
        labelId="select-label"
        id="select"
        value={currentFestival.toString()}
        label="Festival actuel"
        onChange={handleChange}
      >
        {allFestivals.map((festival) => (
          <MenuItem key={festival.id} value={festival.id}>{festival.edition}</MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}