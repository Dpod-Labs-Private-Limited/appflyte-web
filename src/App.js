import { useEffect, useState } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import { Box, Button, Typography } from '@mui/material';
import { getMainStyles } from './styles/styles';
import { useTheme } from '@mui/material/styles';

import Sidebar from './pages/sidebar/index';
import Navbar from './pages/navbar/index';
import { useCredit } from './context/CreditContext';
import ProtectedRoutes from './Routes/ProtectedRoutes';
import { routesConfig } from './Routes/Routes';

import Authentication from './Auth/Authentication';
import InviteSignIn from './Auth/InviteSignIn';
import Authorized from './Auth/Authorized';
// import useAuthCheck from './Auth/AuthTokenCheck';

import { useCollection } from './context/CollectionContext';
import { useAppContext } from './context/AppContext';
import CollectionTypesService from './Api/Services/collection/collectionTypesService';
import { APPLICATION_CODE_PLURAL, OTHER_PLURAL_ID } from './utils/constants';

function App() {
  const location = useLocation()
  const theme = useTheme()
  const navigate = useNavigate()
  const mainStyles = getMainStyles(theme);

  const { shouldShowCreditWarning } = useCredit();
  const { selectedProject } = useAppContext();

  const {
    centralLoadingFlags, setCentralLoadingFlag,
    collectionTypeList, setCollectionTypeList,
    collectionPublishedList, setCollectionPublishedList,
    fieldSetList, setFieldSetList,
    fieldSetListPublished, setFieldSetListPublished
  } = useCollection();

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [parsedDPODToken, setParsedDPODToken] = useState(null)
  const [fileLoading, setFileLoading] = useState(false);
  const [open, setOpen] = useState(true);

  // useAuthCheck(isAuthenticated)

  useEffect(() => {
    handleAuthentication();
    //eslint-disable-next-line
  }, [navigate]);

  useEffect(() => {
    if (parsedDPODToken && selectedProject) {
      fetchCollectionTypes();
      fetchPublishedCollection();
      fetchFieldSets();
      fetchPublishedFieldset()
      //eslint-disable-next-line
    }
  }, [parsedDPODToken, selectedProject]);

  const handleAuthentication = async () => {
    const jwtIdToken = localStorage.getItem('dpod-token');
    if (location.pathname !== "/authorized") {
      if (jwtIdToken) {
        try {
          const parsedToken = jwtDecode(jwtIdToken)
          setParsedDPODToken(parsedToken)
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

  const fetchCollectionTypes = () => {
    if (parsedDPODToken && selectedProject) {
      setCentralLoadingFlag(prev => ({ ...prev, collectionTypes: true }))

      const accID = parsedDPODToken.root_account_id
      const subscriberId = parsedDPODToken.subscriber_id
      const subscriptionId = parsedDPODToken.subscription_id
      const schemaId = selectedProject.payload.__auto_id__

      CollectionTypesService
        .getAllCollectionTypesForCoach(accID, subscriptionId, subscriberId, schemaId)
        .then(res => {
          setCollectionTypeList(res.data)
        })
        .catch(err => {
          console.log("Error occured while fetching all collection type list for a coach", err)
          setCollectionTypeList()
        })
        .finally(() => {
          setCentralLoadingFlag(prev => ({ ...prev, collectionTypes: false }))
        })
    }
  }

  const fetchPublishedCollection = async () => {
    try {
      if (parsedDPODToken && selectedProject) {

        setCentralLoadingFlag(prev => ({ ...prev, publishedCollection: true }))

        const accID = parsedDPODToken.root_account_id
        const subscriberId = parsedDPODToken.subscriber_id
        const subscriptionId = parsedDPODToken.subscription_id
        const schemaId = selectedProject.payload.__auto_id__

        let publishedList = []
        let lastKey = null
        let counter = 0
        const limit = 50

        try {

          do {
            const res = await CollectionTypesService.getPublishedCollectionTypesPagination(accID, subscriptionId, subscriberId, schemaId, lastKey, limit)
            const latest_data = res?.data?.items ?? [];
            publishedList = [...publishedList, ...latest_data]

            if (res.data.last_evaluated_key == null) {
              lastKey = null
            }
            else if (typeof res.data.last_evaluated_key === "object")
              lastKey = encodeURIComponent(JSON.stringify(res.data.last_evaluated_key))
            else
              lastKey = null
            counter++
          }

          while (lastKey !== null && counter <= 5);
          const versionMap = {}
          const filteredList = []
          let pos = 0

          for (const item of publishedList) {
            if (item.base_defition_entity_key in versionMap) {
              if (versionMap[item.base_defition_entity_key].version >= parseInt(item.base_defition_entity_version))
                continue
              filteredList[versionMap[item.base_defition_entity_key].index] = item
              versionMap[item.base_defition_entity_key].version = parseInt(item.base_defition_entity_version)
            }
            else {
              versionMap[item.base_defition_entity_key] = {
                index: pos,
                version: parseInt(item.base_defition_entity_version)
              }
              filteredList[pos] = item
              pos += 1
            }
          }
          const filteredListFinal = filteredList.filter(x => (x.api_prural_id === OTHER_PLURAL_ID.websiteRequest || x.api_prural_id === APPLICATION_CODE_PLURAL.lookups || (x.system_predefined === false && x.system_utility === false && x.soft_deleted === false)))
          setCollectionPublishedList(filteredListFinal)
        }
        catch (err) {
          console.log("Error occured while fetching published collection type list for a coach", err)
          setCollectionPublishedList([])
        }
        finally {
          setCentralLoadingFlag(prev => ({ ...prev, publishedCollection: false }))
        }
      }
    } catch (err) {
      console.log("Error occured while fetching published collection type list for a coach", err)
      setCollectionPublishedList([])
    } finally {
      setCentralLoadingFlag(prev => ({ ...prev, publishedCollection: false }))
    }
  }

  const fetchFieldSets = () => {
    if (parsedDPODToken) {
      setCentralLoadingFlag(prev => ({ ...prev, fieldSets: true }))

      const accID = parsedDPODToken.root_account_id
      const subscriberId = parsedDPODToken.subscriber_id
      const subscriptionId = parsedDPODToken.subscription_id
      const schemaId = selectedProject.payload.__auto_id__

      CollectionTypesService
        .getAllFieldSetsForCoach(accID, subscriptionId, subscriberId, schemaId)
        .then(res => { setFieldSetList(res.data) })
        .catch(err => {
          console.log("Error occured while fetching all collection type list for a coach", err)
          setFieldSetList([])
        })
        .finally(() => {
          setCentralLoadingFlag(prev => ({ ...prev, fieldSets: false }))
        })
    }
  }

  const fetchPublishedFieldset = async () => {
    try {
      if (parsedDPODToken && selectedProject) {

        setCentralLoadingFlag(prev => ({ ...prev, publishedCollection: true }))

        const accID = parsedDPODToken.root_account_id
        const subscriberId = parsedDPODToken.subscriber_id
        const subscriptionId = parsedDPODToken.subscription_id
        const schemaId = selectedProject.payload.__auto_id__

        let publishedList = []
        let lastKey = null
        let counter = 0
        const limit = 50

        try {

          do {
            const res = await CollectionTypesService.getPublishedFieldSets(accID, subscriptionId, subscriberId, schemaId, lastKey, limit)

            const latest_data = res?.data?.items ?? [];
            publishedList = [...publishedList, ...latest_data]

            if (res.data.last_evaluated_key == null) {
              lastKey = null
            } else if (typeof res.data.last_evaluated_key === "object")
              lastKey = encodeURIComponent(JSON.stringify(res.data.last_evaluated_key))
            else
              lastKey = null
            counter++
          }

          while (lastKey !== null && counter <= 5);
          const versionMap = {}
          const filteredList = []
          let pos = 0

          for (const item of publishedList) {
            if (item.base_defition_entity_key in versionMap) {
              if (versionMap[item.base_defition_entity_key].version >= parseInt(item.base_defition_entity_version))
                continue
              filteredList[versionMap[item.base_defition_entity_key].index] = item
              versionMap[item.base_defition_entity_key].version = parseInt(item.base_defition_entity_version)
            }
            else {
              versionMap[item.base_defition_entity_key] = {
                index: pos,
                version: parseInt(item.base_defition_entity_version)
              }
              filteredList[pos] = item
              pos += 1
            }
          }
          setFieldSetListPublished(filteredList)
        }
        catch (err) {
          console.log("Error occured while fetching published collection type list for a coach", err)
          setFieldSetListPublished([])
        }
        finally {
          setCentralLoadingFlag(prev => ({ ...prev, publishedCollection: false }))
        }
      }
    } catch (err) {
      console.log("Error occured while fetching published collection type list for a coach", err)
      setFieldSetListPublished([])
    } finally {
      setCentralLoadingFlag(prev => ({ ...prev, publishedCollection: false }))
    }
  }

  const tostAlert = (msg, mode) => {
    if (mode === 'success')
      toast.success(msg)
    else if (mode === 'info')
      toast.info(msg)
    else if (mode === 'warning')
      toast.warn(msg)
    else if (mode === 'error')
      toast.error(msg)
  }

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
                  <Route element={
                    <ProtectedRoutes

                      isAuthenticated={isAuthenticated}

                      centralLoadingFlags={centralLoadingFlags}
                      tostAlert={tostAlert}
                      selectedUser={parsedDPODToken}
                      emailVerified={true}

                      collectionTypeList={collectionTypeList}
                      collectionPublishedList={collectionPublishedList}
                      fetchCollectionTypes={fetchCollectionTypes}
                      fetchPublishedCollection={fetchPublishedCollection}

                      fieldSetList={fieldSetList}
                      fieldSetListPublished={fieldSetListPublished}
                      fetchFieldSets={fetchFieldSets}
                      fetchPublishedFieldset={fetchPublishedFieldset}

                      setLoading={setFileLoading}
                      staffList={[]}

                      open={open}
                      setOpen={setOpen}

                    />}
                  >
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