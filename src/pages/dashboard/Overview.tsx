import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

import Title from './Title';
import Benevole from '../../interfaces/Benevole';

function preventDefault(event: React.MouseEvent) {
  event.preventDefault();
}

export default function Overview({benevoles}: {benevoles: Benevole[]}) {
  return (
    <React.Fragment>
      <Title>Inscriptions</Title>
      <Typography component="p" variant="h4">
        {benevoles.length}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {"Ceci est le nombre d'inscriptions depuis le début "}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={preventDefault}>
          Voir plus
        </Link>
      </div>
    </React.Fragment>
  );
}