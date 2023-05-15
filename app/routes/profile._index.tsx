import type { ActionArgs, HeadersFunction, LoaderArgs } from '@remix-run/node';
import { verifyIdToken, USER_JWT_KEY } from '~/servers/jwt.server';

import { useContext, useEffect, useState } from 'react';
// import { useAuth0 } from '@auth0/auth0-react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
// import Grid from '@material-ui/core/Grid';
import Typography from '@mui/material/Typography';

export const loader = async ({ params, request }: LoaderArgs) => {
  console.log('requestrequest:', request);
  const jwt = await verifyIdToken(request);
  console.log('jwwwwt!!:', jwt);
  return jwt;
};

export default function Profile() {
//  const config = useContext(ApiContext);
    // const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
    const [currentStatus, setCurrentStatus] = useState({});
  // useEffect(() => {
  //   const getCurrentStatus = async () => {
  //     const {
  //       apiBaseUrl,
  //       data: {
  //         audience
  //       }
  //     } = config;

  //     try {
  //       const accessToken = await getAccessTokenSilently({
  //         audience,
  //         scope: 'read:signs',
  //       });
  
  //       const userDetailsByIdUrl = `${apiBaseUrl}/status`;
  
  //       const metadataResponse = await fetch(userDetailsByIdUrl, {
  //         credentials: 'include',
  //         headers: {
  //           Authorization: `Bearer ${accessToken}`,
  //         },
  //       });
  
  //       const data = await metadataResponse.json();

  //       setCurrentStatus(data);
  //     } catch (e) {
  //       console.log(e);
  //     }
  //   };
  
  //   getCurrentStatus();
  // }, [getAccessTokenSilently, config]);
  const user = {
    picture: 'picture',
    name: 'name',
  }

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