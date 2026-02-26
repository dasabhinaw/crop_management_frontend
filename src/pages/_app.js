// pages/_app.js
import { useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import {useStore} from '@/app/store';
import { checkAuth } from '@/features/auth/authSlice';
import Layout from '../components/Layout';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from '@/assets/theme';
import { useRouter } from 'next/router';
import SuccessAnimation from '@/components/common/SuccessAnimation'

function MyApp({ Component, pageProps }) {
  const store = useStore();
  const router = useRouter();
  useEffect(() => {
    // Dispatch checkAuth only if not on the login page
    if (router.pathname !== '/login') {
      store.dispatch(checkAuth()).then((result) => {
        if (result.error) {
          // Redirect to login page if unauthorized
          router.push('/login');
        }
      });
    }
  }, [store, router.pathname]);

  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <SuccessAnimation />
        {router.pathname === '/login' ? (
          <Component {...pageProps} />
        ) : (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        )}
      </ThemeProvider>
    </Provider>
  );
}

export default MyApp;