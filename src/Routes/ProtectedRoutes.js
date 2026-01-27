import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routesConfig } from './Routes';
import { useAppContext } from '../context/AppContext';

function ProtectedRoutes({ isAuthenticated }) {
    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;
    const { selectedOrganization, selectedService } = useAppContext();

    const jwtIdToken = localStorage.getItem('dpod-token');
    if (!jwtIdToken) {
        localStorage.clear()
        sessionStorage.clear()
        navigate("/login")
    }

    const matchRoute = (route) => {
        let regexPath = route.path.replace(/:\w+/g, '[^/]+').replace(/\/\*$/, '(?:/.*)?');
        const regex = new RegExp(`^${regexPath}$`);
        return regex.test(currentPath);
    };

    const currentRoute = routesConfig.find(matchRoute)

    // if (currentRoute.path !== "/" && currentRoute.path !== "/organizations" &&
    //     currentRoute.path !== "/user/settings" && currentRoute.path !== "/user/billing") {
    //     if (!selectedOrganization) {
    //         navigate("/")
    //     }
    // }

    // if (currentRoute.path !== "/" &&
    //     currentRoute.path !== "/organizations" &&
    //     currentRoute.path !== "/organization/:orgId/services" &&
    //     currentRoute.path !== "/organization/:orgId/services/add-service" &&
    //     currentRoute.path !== "/service-list" &&
    //     currentRoute.path !== "/user/settings" &&
    //     currentRoute.path !== "/user/billing" &&
    //     currentRoute.path !== "/organization/:orgId/api-keys"
    // ) {
    //     if (!selectedService) {
    //         navigate("/")
    //     }
    // }

    if (currentRoute) {
        return <Outlet context={{ isAuthenticated }} />;
    }
}

export default ProtectedRoutes;