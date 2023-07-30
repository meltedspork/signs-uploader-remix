import { ActionArgs, HeadersFunction, LoaderArgs, json } from '@remix-run/node';
import { verifyIdToken } from '~/servers/auth0-jwt.server';

import { useContext, useEffect, useState } from 'react';

import { getUser } from '~/servers/session.server';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Grid from '@material-ui/core/Grid';
import Typography from '@mui/material/Typography';
import { useUser } from '~/root';

export default function Profile() {
  const { user } = useUser();

  console.log('Profile: useUser--->', user);
    const [currentStatus, setCurrentStatus] = useState({});

  // const user = {
  //   picture: 'picture',
  //   name: 'name',
  // }

  return (
    <main>
      <Card sx={{ maxWidth: 345, overflow: 'inherit' }}>
        <CardMedia
          component='img'
          alt={user?.name}
          image={user?.picture}
        />
        <CardContent>
          <Typography gutterBottom component='pre'>
            {JSON.stringify(user, null, 2)}
          </Typography>
          <h3>
            Current Status
          </h3>
          <Typography component='pre' color='text.secondary'>
            {currentStatus ? (
              JSON.stringify(currentStatus, null, 2)
            ) : (
              'No Status'
            )}
          </Typography>
        </CardContent>
      </Card>
    </main>
  );
}