import HomeLayout from "../containers/HomeLayout";
import MainHome from "../containers/Home/MainHome";
import ExternalSignup from "../containers/Home/ExternalSignup";
import Organizations from "../containers/Organizations";
import Services from "../containers/Services";
import ServiceAdd from "../containers/ServiceAdd";
import Spaces from "../containers/Spaces/index";
import AddWorkspace from "../containers/WorkspaceAdd/index";
import Projects from "../containers/Projects/index";
import AddProject from "../containers/ProjectAdd/index";

import SettingsHome from "../containers/Settings/SettingsHome";
import UserManagement from "../pages/UserManagement";

import ExtractionHome from "../containers/Extraction/Home";
import ExtractionDocumentTypes from "../containers/Extraction/DocumentTypes";
import AddDocumentTypes from "../containers/Extraction/DocumentTypes/AddDocumentTypes";
import DocumentLists from "../containers/Extraction/DocumentTypes/DocumentLists";
import ExtractionDocuments from "../containers/Extraction/Documents";
import ViewDocument from "../containers/Extraction/Documents/ViewDocument";
import ExtractionConnectors from "../containers/Extraction/Connectors";

import AnalyticsHome from "../containers/Analytics/Home";
import DataSource from "../containers/Analytics/DataSource";
import Datasets from "../containers/Analytics/Datasets/DatasetList";
import SourceLists from "../containers/Analytics/Datasets/SourceLists";
import DatasetAdd from "../containers/Analytics/Datasets/DatasetConfig/add";
import DatasetEdit from "../containers/Analytics/Datasets/DatasetConfig/edit";
import AiApps from "../containers/Analytics/AiApps";
import AddChatbot from "../containers/Analytics/Chatbot/AddChatbot";
import EditChatbot from "../containers/Analytics/Chatbot/EditChatbot";
import ApiKeys from "../pages/ApiKeys";
import BilingHome from "../pages/Billing";
import UserSetup from '../containers/Home/UserSetup';

export const routesConfig = [
    {
        path: '/',
        element: <HomeLayout />,
        component: 'home'
    },
    {
        path: '/home',
        element: <MainHome />,
        component: 'home'
    },
    {
        path: '/onboarding',
        element: <UserSetup />,
        component: 'home'
    },
    {
        path: '/organizations',
        element: <Organizations />,
        component: 'home'
    },
    {
        path: '/organization/:orgId/services',
        element: <Services />,
        component: 'home'
    },
    {
        path: '/organization/:orgId/services/add-service',
        element: <ServiceAdd />,
        component: 'home'
    },
    {
        path: '/organization/:orgId/workspaces',
        element: <Spaces />,
        component: 'spaces'
    },
    {
        path: '/organization/:orgId/workspaces/:action',
        element: <AddWorkspace />,
        component: 'spaces'
    },
    {
        path: '/organization/:orgId/workspace/:spaceId/projects',
        element: <Projects />,
        component: 'projects'
    },
    {
        path: '/organization/:orgId/workspace/:spaceId/projects/:action',
        element: <AddProject />,
        component: 'projects'
    },


    {
        path: '/settings/*',
        element: <SettingsHome />,
        component: 'settings'
    },
    {
        path: '/user/settings',
        element: <UserManagement />,
        component: 'Users'
    },
    {
        path: '/organization/:orgId/api-keys',
        element: <ApiKeys />,
        component: 'Users'
    },
    {
        path: '/user/billing',
        element: <BilingHome />,
        component: 'Users'
    }
];