import * as React from 'react';
import { useNavigate } from '@remix-run/react';
import { useAuth0 } from '@auth0/auth0-react';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';

const NavigatorBar = () => {
  const {
    isLoading,
    isAuthenticated,
    error,
    user,
    loginWithRedirect,
    logout
  } = useAuth0();
  const navigate = useNavigate();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  return (
    <React.Fragment>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: 'wrap' }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Signs Uploader
          </Typography>
          {isAuthenticated ?
            <nav>
              <IconButton onClick={() => navigate("/profile")}>
                <Avatar alt={user?.nickname} src={user?.picture} />
                <Typography
                  variant="button"
                  color="text.primary"
                  sx={{ my: 1, mx: 1.5 }}
                >
                  Heyoo {user?.nickname}!
                </Typography>
              </IconButton>
              <Button onClick={() => logout({
                async openUrl(url) {
                  window.location.replace(url);
                }
              })} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                Logout
              </Button>
            </nav>
            :
            <Button onClick={() => loginWithRedirect()} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
              Login
            </Button>
          }
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

export default NavigatorBar;
