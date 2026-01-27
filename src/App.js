import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import { getMainStyles } from './styles/styles';
import { useTheme } from '@mui/material/styles';
import Sidebar from './pages/Sidebar';
import Navbar from './pages/Navbar/index';

import { useCredit } from './context/CreditContext';
import ProtectedRoutes from './Routes/ProtectedRoutes';
import { routesConfig } from './Routes/Routes';

import Authentication from './Auth/Authentication';
import InviteSignIn from './Auth/InviteSignIn';
import Authorized from './Auth/Authorized';
import RootUserHome from './pages/RootUser';
import useAuthCheck from './Auth/AuthTokenCheck';
import { Box, Button, Typography } from '@mui/material';

function App() {
  const location = useLocation()
  const theme = useTheme()
  const navigate = useNavigate()
  const mainStyles = getMainStyles(theme);

  const { shouldShowCreditWarning } = useCredit();
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useAuthCheck(isAuthenticated)

  useEffect(() => {
    handleAuthentication();
    //eslint-disable-next-line
  }, [navigate]);

  useEffect(() => {
    loadPdfJs()
  }, [])

  const handleAuthentication = async () => {
    const tokenString = localStorage.getItem('dpod-token');
    if (location.pathname !== "/authorized") {
      if (tokenString) {
        try {
          setIsAuthenticated(true);
          if (location.pathname === "/login" || location.pathname === "/invite-login") {
            navigate('/')
          }
        } catch (error) {
          console.error("Failed to parse token:", error);
          setIsAuthenticated(false);
          localStorage.clear();
          if (location.pathname !== '/invite-login' && location.pathname !== '/root-user') {
            navigate('/login');
          }
        }
      } else {
        setIsAuthenticated(false);
        localStorage.clear();

        const currentPath = location.pathname;
        const skipPaths = ['/invite-login', '/root-user', '/login'];

        if (!skipPaths.includes(currentPath)) {
          navigate('/login', {
            state: { from: currentPath + location.search }
          });
        }

      }
    }
  };

  const loadPdfJs = async () => {
    if (!window.pdfjsLib) {
      console.warn('PDF.js is not loaded yet');
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
      script.onload = () => {
        if (window.pdfjsLib) {
          window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
        }
      };
      document.head.appendChild(script);
      return () => document.head.removeChild(script);
    }
  };

  const showCreditWarning = shouldShowCreditWarning({ pathname: location.pathname });

  return (

    <div style={mainStyles.appContainer}>

      <ToastContainer position="top-center" autoClose={3500} hideProgressBar newestOnTop={false} closeOnClick
        rtl={false} pauseOnFocusLoss draggable pauseOnHover theme='colored' />

      {!isAuthenticated
        ?
        (<Routes>
          <Route path='/login' element={<Authentication />}></Route>
          <Route path='/invite-login' element={<InviteSignIn />}></Route>
          <Route path='/authorized' element={<Authorized />}></Route>
          <Route path='/root-user' element={<RootUserHome />} />
        </Routes>)
        :
        (<>

          {shouldShowCreditWarning({ pathname: location.pathname }) && (
            <Box sx={{ ...mainStyles.creditContainer }}>
              <Typography>
                Your credits have run out. Please top up account to continue.
              </Typography>

              <Button
                sx={mainStyles.addBtn}
                onClick={() => navigate("/user/billing")}
              >
                ADD CREDIT
              </Button>
            </Box>
          )}

          <div style={mainStyles.layoutContainer(showCreditWarning)}>

            <div style={mainStyles.sidebarContainer(showCreditWarning)}>
              <Sidebar />
            </div>

            <div style={mainStyles.rightSection}>

              <div style={mainStyles.mainNavbar}>
                <Navbar />
              </div>

              <main style={mainStyles.mainContent}>
                <Routes>
                  <Route element={<ProtectedRoutes isAuthenticated={isAuthenticated} />}>
                    {routesConfig.map((route, index) => (
                      <Route key={index} path={route.path} element={route.element} />
                    ))}
                  </Route>
                </Routes>
              </main>

            </div>

          </div>
        </>)
      }

    </div>

  );
}

export default App;