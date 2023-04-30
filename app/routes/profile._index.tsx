import { useContext, useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';

export default function Profile() {
//  const config = useContext(ApiContext);
    const { user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
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
  //         scope: "read:signs",
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

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardMedia
        component="img"
        alt={user?.name}
        image={user?.picture}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
        <pre>{JSON.stringify(user, null, 2)}</pre>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <h3>Current Status</h3>
          {currentStatus ? (
            <pre>{JSON.stringify(currentStatus, null, 2)}</pre>
          ) : (
            'No Status'
          )}
        </Typography>
      </CardContent>
    </Card>
  );
}