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
import { prisma } from '~/servers/db.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({ request }: LoaderArgs) => {
  const users = await prisma.users.findMany();

  return json({
    users
  });
};

export default function Users() {
  const {
    users,
  } = useLoaderData<typeof loader>();

  const { user } = useUser();

  console.log('Users: currentUser--->', user);
  console.log('Users: allIsers--->', users);

    const [currentStatus, setCurrentStatus] = useState({});


  return (
    <main>
      <h1>Users</h1>
    
    </main>
  );
}