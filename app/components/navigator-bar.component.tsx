import { useNavigate } from '@remix-run/react';

import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import type { UserSerializedData } from '~/modules/user.module';
import { LOGIN_REDIRECT_URL, LOGOUT_REDIRECT_URL, ROOT_REDIRECT_URL } from '~/constants';

const NavigatorBarComponent = ({
  user,
  userAuthenticated
}: {
  user: UserSerializedData | null;
  userAuthenticated: boolean;
}) => {
  const navigate = useNavigate();
  console.log('user: ', user);

  return (
    <AppBar
      position='static'
      color='default'
      elevation={0}
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
    >
      <Toolbar sx={{ flexWrap: 'wrap' }}>
        <Link
          href={ROOT_REDIRECT_URL}
          variant='h6'
          color='inherit'
          noWrap sx={{ flexGrow: 1 }}
          style={{ textDecoration:'none' }}
        >
          Signs Uploader
        </Link>
        {userAuthenticated ?
          <nav>
            <IconButton
              onClick={() =>
              navigate('/profile')}
            >
              <Avatar alt={user?.name} src={user?.pictureImgPath} />
              <Typography
                variant='button'
                color='text.primary'
                sx={{ my: 1, mx: 1.5 }}
              >
                Heyoo {user?.name}!
              </Typography>
            </IconButton>
            <Button
              onClick={() => navigate(LOGOUT_REDIRECT_URL)}
              variant='outlined'
              sx={{ my: 1, mx: 1.5 }}
            >
              Logout
            </Button>
          </nav>
        :
          <Button
            onClick={() => navigate(LOGIN_REDIRECT_URL)}
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
