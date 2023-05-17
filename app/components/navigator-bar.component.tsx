import * as React from 'react';
import { useNavigate } from '@remix-run/react';
// import { useAuth0 } from '@auth0/auth0-react';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const NavigatorBarComponent = (props: any) => {

  const navigate = useNavigate();

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  // if (error) {
  //   return <div>Oops... {error.message}</div>;
  // }

  // const loginWithRedirect = (msg = 'naka') => console.log(msg);
  // const logout = (msg = 'noko') => console.log(msg)
  const isAuthenticated = false;
  const user = {
    nickname: 'nickname',
    picture: 'picture.jpg',
  }
 
  console.log('props: ', props);

  return (
    <AppBar
      position='static'
      color='default'
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Link
            href='/'
            variant='h6'
            color='inherit'
            noWrap sx={{ flexGrow: 1 }}
            style={{ textDecoration:'none' }}
          >
            Signs Uploader
          </Link>
          {isAuthenticated ?
        <nav>
      <IconButton
        onClick={() =>
        navigate('/profile')}
      >
        <Avatar alt={user?.nickname} src={user?.picture} />
        <Typography
          variant='button'
          color='text.primary'
          sx={{ my: 1, mx: 1.5 }}
        >
          Heyoo {user?.nickname}!
        </Typography>
      </IconButton>
                <Button
                  onClick={() => navigate('/logout')}
                  variant='outlined'
                  sx={{ my: 1, mx: 1.5 }}
                >
                  Logout
                </Button>
              </nav>
              :
              <React.Fragment>
                  <Button
                  onClick={() => navigate('/logout')}
                  variant='outlined'
                  sx={{ my: 1, mx: 1.5 }}
                >
                  Logout
                </Button>
                <Button
                onClick={() => navigate('/login')}
                variant='outlined'
                sx={{ my: 1, mx: 1.5 }}
              >
                Login
              </Button>
              </React.Fragment>
            }
          </Toolbar>
        </AppBar>
  );
}

export default NavigatorBarComponent;
