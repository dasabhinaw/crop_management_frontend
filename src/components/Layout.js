import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router';
import Link from 'next/link';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import MenuIcon from '@mui/icons-material/Menu';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import { ListItemButton, ListItemIcon, ListItemText } from '@mui/material';
import { AccessTimeFilled, Dashboard, LocalPrintshop, Logout, School, PeopleAlt, PropaneTank, AcUnit} from '@mui/icons-material';
import { logout, getUserInfoState } from '@/features/auth/authSlice'
import CurrencyExchangeIcon from '@mui/icons-material/CurrencyExchange';
import AssuredWorkloadIcon from '@mui/icons-material/AssuredWorkload';
import { fetchUserPermission, resetUserPermission } from '@/features/userPermissionSlice'
import useUserPermissionHook from '@/app/hook/userPermissionHook'
import WbSunnyIcon from '@mui/icons-material/WbSunny';

const drawerWidth = 240;

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Layout({children}) {
  const dispatch = useDispatch();
  const location = useRouter();
  const userInfo = useSelector(getUserInfoState);
  const [open, setOpen] = useState(false);
  const userPermission = useUserPermissionHook.useUserPermission();
  const userPermissionLoading = useUserPermissionHook.useUserPermissionLoading();
  const toggleDrawer = () => {
    setOpen(!open);
  };
  const handleLogout = () => {
    dispatch(logout());
    dispatch(resetUserPermission());
    location.push('/login');
  }
  // useEffect(() => {
  //   if(!userPermission){
  //     dispatch(fetchUserPermission());
  //   }
  // },[dispatch,userPermission])
  useEffect(() => {
      dispatch(fetchUserPermission());
  },[dispatch])
  return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: '24px', // keep right padding when drawer closed
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: '36px',
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              <Link href='/dashboard' style={{textDecoration:'none',color:'white'}}>Agri-Monitoring</Link>
            </Typography>
            {/* <NotificationBell /> */}
            <IconButton color="inherit">
              <Typography
                  component="h6"
                  variant="body2"
                  color="inherit"
                  noWrap
                  sx={{ flexGrow: 1 }}
                  style={{fontWeight:600}}
              >
                  <Link href='/profile' style={{textDecoration:'none',color:'white'}} >{userInfo && userInfo}</Link>
              </Typography>
            </IconButton>
            <IconButton color="inherit"   >
              <Logout onClick={handleLogout}/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          
          <List component="nav" sx={{marginTop:'55px'}}>
            <ListItemButton component={Link} href={'/'} selected={location.pathname === '/'}>
                <ListItemIcon>
                    <Dashboard />
                </ListItemIcon>
                <ListItemText primary='Dashboard' />
            </ListItemButton>
            <ListItemButton component={Link} href='/weather' selected={location.pathname === '/weather'}>
                <ListItemIcon>
                    <WbSunnyIcon />
                </ListItemIcon>
                <ListItemText primary='Weather' />
            </ListItemButton>
            <ListItemButton component={Link} href='/nepali-season' selected={location.pathname === '/nepali-season'}>
                <ListItemIcon>
                    <AcUnit />
                </ListItemIcon>
                <ListItemText primary='Season' />
            </ListItemButton>
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {children}
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}