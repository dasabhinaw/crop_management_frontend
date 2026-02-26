// pages/index.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import Head from 'next/head';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { login, getError,getIsLoading, getUserInfoState} from '@/features/auth/authSlice'
import { clearError } from '@/features/auth/authSlice'

const defaultTheme = createTheme();

export default function Page() {
  const dispatch = useDispatch();
  const error = useSelector(getError);
  const is_loading = useSelector(getIsLoading);
  const user = useSelector(getUserInfoState);
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  
  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    // Clear error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };
  const canSubmit = formData.username.length > 4 && formData.password.length > 4 && !is_loading;
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(login({ username: formData.username, password: formData.password }));
  };
  return (
    <div>
      <Head>
        <title>Login</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign in
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="username"
                        id="username"
                        label="Username or E-Mail"
                        type='text'
                        value={formData.username}
                        onChange={handleChange}
                        autoFocus
                        />
                        <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        />
                        {error &&
                        <Alert severity='error'>
                            <AlertTitle>{error}</AlertTitle>
                        </Alert>
                        }
                        <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={!canSubmit}
                        >
                        {is_loading ? 'Signing in...' : 'Sign In'}  
                        </Button>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    </div>
  );
}