import { useNavigate } from '@remix-run/react';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import { Auth0JwtIdToken } from '~/modules/auth0-jwt.server';

const NavigatorBarComponent = ({
  isAuthenticated,
  userProfile: user
}: {
  isAuthenticated: boolean;
  userProfile: Auth0JwtIdToken | null
}) => {
  const navigate = useNavigate();
  console.log('profile: ', user);

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
          <Button
            onClick={() => navigate('/login')}
            variant='outlined'
            sx={{ my: 1, mx: 1.5 }}
          >
            Login
          </Button>
        }
      </Toolbar>
    </AppBar>
  );
}

export default NavigatorBarComponent;
