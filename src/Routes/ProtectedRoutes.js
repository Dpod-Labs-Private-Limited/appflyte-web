import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { routesConfig } from './Routes';

function ProtectedRoutes(props) {

    const { isAuthenticated, centralLoadingFlags, tostAlert, selectedUser, emailVerified, collectionTypeList, fetchCollectionTypes,
        fetchPublishedCollection, fieldSetList, fetchFieldSets, fieldSetListPublished, collectionPublishedList, setLoading, staffList, open, setOpen } = props;

    const location = useLocation();
    const navigate = useNavigate();
    const currentPath = location.pathname;

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
    if (currentRoute) {
        return <Outlet context={{
            isAuthenticated,

            centralLoadingFlags,
            tostAlert,
            selectedUser,
            emailVerified,
            location,
            navigate,

            collectionTypeList,
            fetchCollectionTypes,
            fetchPublishedCollection,

            fieldSetList,
            fetchFieldSets,
            fieldSetListPublished,
            collectionPublishedList,
            setLoading,
            staffList,

            open,
            setOpen
        }} />;
    }
}

export default ProtectedRoutes;