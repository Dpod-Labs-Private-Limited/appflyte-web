import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ReactSVG } from "react-svg";
import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import './styles.css';
import { getStyles } from "./styles";
import { IconSvg } from '../../utils/globalIcons';
import { routesConfig } from '../../Routes/Routes';
import { setProjectAccessState, setWorkspaceAccessState } from '../../Redux/slice/dataSlice';
import { useAppContext } from '../../context/AppContext';
import { useCredit } from '../../context/CreditContext';

function Sidebar() {

  const theme = useTheme();
  const styles = getStyles(theme);
  const location = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { selectedOrganization, selectedService, selectedWorkspace, selectedProject, permissionStatus, setSelectedWorkspace,
    setSelectedProject, setPermissionStatus, billingStatus, setBillingStatus, isOrganizationOwner,
    apiKeyStatus, setApiKeyStatus } = useAppContext();
  const [selectedMenuItem, setSelectedMenuItem] = useState(1);
  const { credit } = useCredit();

  const menuItems = [
    {
      icon: IconSvg.flagIcon,
      label: 'Get Started',
      path: 'home'
    },
    {
      icon: IconSvg.spaceIcon,
      label: 'Spaces',
      path: 'spaces'
    },
    {
      icon: IconSvg.projectIcon,
      label: 'Projects',
      path: 'projects'
    },
    {
      icon: IconSvg.settingsIcon,
      label: 'Settings',
      path: 'settings'
    },
    {
      icon: IconSvg.collectionTypeIcon,
      label: 'Collection Types',
      path: 'collection_types'
    },
    {
      icon: IconSvg.collectionIcon,
      label: 'Collections',
      path: 'collections'
    },
    {
      icon: IconSvg.mediaIcon,
      label: 'Files',
      path: 'files'
    }
  ];

  const filteredMenuItems = () => {

    let items = [];

    if (!selectedOrganization || !selectedService) {
      items.push(menuItems.find(item => item.path === 'home'));
    }

    if (selectedOrganization && selectedService) {
      items.push(menuItems.find(item => item.path === 'spaces'));
    }

    if (selectedOrganization && selectedService && selectedWorkspace && !selectedProject) {
      items.push(menuItems.find(item => item.path === 'projects'));
    }

    if (selectedOrganization && selectedService && selectedWorkspace && selectedProject) {
      const selected_sidebar_items = selectedProject?.payload?.configuration?.engine_config?.sidebar_items ?? []
      const allowedLabels = new Set(Object.keys(selected_sidebar_items));
      items = menuItems.filter(item => allowedLabels.has(item.path));
    }
    return items;
  };

  useEffect(() => {
    const currentPath = location.pathname;
    const activeRoute = routesConfig.find(route => {
      let regexPath = route.path
        .replace(/:\w+/g, '[^/]+')
        .replace(/\/\*$/, '(?:/.*)?');
      const regex = new RegExp(`^${regexPath}$`);
      return regex.test(currentPath);
    });
    if (!activeRoute) return;
    const index = filteredMenuItems().findIndex(item => item.path === activeRoute.component);
    if (index !== -1) setSelectedMenuItem(index);
    //eslint-disable-next-line
  }, [location]);

  useEffect(() => {
    if (location?.pathname === "/user/billing" && !selectedOrganization) {
      navigate('/organizations')
    }

    if (location?.pathname === "/user/billing" && selectedOrganization) {
      setPermissionStatus(false)
      setBillingStatus(true)
      setApiKeyStatus(false)
    }
    //eslint-disable-next-line
  }, [location])


  const handlePageRouting = (path) => {
    const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
    const workspace_id = selectedWorkspace?.payload?.__auto_id__ ?? null;
    const project_id = selectedProject?.payload?.__auto_id__ ?? null;

    switch (path) {

      case 'home':
        navigate('/')
        break;

      case 'spaces':
        navigate(`/organization/${organization_id}/workspaces`)
        break;

      case 'projects':
        navigate(`/organization/${organization_id}/workspace/${workspace_id}/projects`)
        break;

      case 'collection_types':
        navigate(`/workspace/${workspace_id}/project/${project_id}/collection-types`)
        break;

      case 'collections':
        navigate(`/workspace/${workspace_id}/project/${project_id}/collections`)
        break;

      case 'files':
        navigate(`/workspace/${workspace_id}/project/${project_id}/files`)
        break;

      case 'settings':
        navigate('/settings')
        break;

      default:
        navigate('/')
    }
  };

  const handleMenuItemClick = (index, path) => {
    dispatch(setWorkspaceAccessState({}))
    dispatch(setProjectAccessState({}))
    setPermissionStatus(false)
    setBillingStatus(false)
    setApiKeyStatus(false)
    if (!path) {
      setSelectedMenuItem(index);
      navigate('/')
      return
    }
    setSelectedMenuItem(index);
    handlePageRouting(path)
  };


  const handlePermissions = () => {
    setBillingStatus(false)
    setPermissionStatus(true)
    setApiKeyStatus(false)
    setSelectedWorkspace(null)
    setSelectedProject(null)
    navigate('/user/settings')
  }

  const handleApiKeys = () => {
    setBillingStatus(false)
    setPermissionStatus(false)
    setSelectedWorkspace(null)
    setSelectedProject(null)
    setApiKeyStatus(true)
    const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null
    navigate(`/organization/${organization_id}/api-keys`)
  }

  const handleBilling = () => {
    setPermissionStatus(false)
    setBillingStatus(true)
    setApiKeyStatus(false)
    navigate('/user/billing')
  }

  return (

    <nav style={styles.sidebar}>
      <ul className="menu">
        {filteredMenuItems()?.map((item, index) => (
          <li key={index}
            className={`menu-item ${(selectedMenuItem === index && (permissionStatus === false && billingStatus === false && apiKeyStatus === false)) ? 'active' : ''}`}
            onClick={() => handleMenuItemClick(index, item.path)}
          >
            <span className="icon">
              <ReactSVG
                src={item.icon}
                className={`subsidebar_icon ${(selectedMenuItem === index && (permissionStatus === false && billingStatus === false && apiKeyStatus === false)) === index ? 'active' : ''}`}
              />
            </span>
            <Typography className="label" variant="body1">{item.label}</Typography>
          </li>
        ))}

      </ul>


      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: credit <= 0 ? '30px' : '10px'
      }}>

        {(selectedOrganization && isOrganizationOwner && process.env.REACT_APP_IS_SFS_INSTANCE !== "true") &&
          <Box
            sx={{
              display: 'flex', justifyContent: 'center', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center', cursor: 'pointer',
              backgroundColor: (billingStatus && !permissionStatus && !apiKeyStatus) && '#007bff', borderRadius: '10px', padding: '10px 13px 10px 13px', margin: '10px',
              marginTop: 0,
              '&:hover': {
                backgroundColor: '#007bff',
              }
            }}
            onClick={() => selectedOrganization && handleBilling()}
          >
            <ReactSVG src={IconSvg.paymentIcon}
              beforeInjection={(svg) => {
                svg.setAttribute('style', 'width:18px; height:18px; display:block;');
                svg.setAttribute('color', '#FFFFFF');
              }}
            />
            <Typography className="label" variant="body1"
              sx={{ fontSize: '10px', fontWeight: '500' }}>
              Billing & Usage
            </Typography>
          </Box>}

        {(selectedOrganization && isOrganizationOwner) &&
          <Box
            sx={{
              display: 'flex', justifyContent: 'center', flexDirection: 'column',
              alignItems: 'center', textAlign: 'center', cursor: 'pointer',
              backgroundColor: (permissionStatus && !billingStatus && !apiKeyStatus) && '#007bff', borderRadius: '10px', padding: '10px 13px 10px 13px', margin: '10px', marginTop: '2px',
              '&:hover': {
                backgroundColor: '#007bff',
              }
            }}
            onClick={handlePermissions}
          >
            <ReactSVG src={IconSvg.rootusersIcon}
              beforeInjection={(svg) => {
                svg.setAttribute('style', 'width:18px; height:18px; display:block;');
                svg.setAttribute('fill', '#FFFFFF');
                svg.setAttribute('color', '#FFFFFF');
              }}
            />
            <Typography className="label" variant="body1"
              sx={{ fontSize: '10px', fontWeight: '500' }}>
              Manage <br />Users
            </Typography>
          </Box>
        }

      </Box>


    </nav>
  );
}

export default Sidebar;