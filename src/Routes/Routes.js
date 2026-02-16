import HomeLayout from "../containers/HomeLayout";
import MainHome from "../containers/Home/MainHome";
import UserSetup from '../containers/Home/UserSetup';
import Organizations from "../containers/Organizations";
import Services from "../containers/Services";
import ServiceAdd from "../containers/ServiceAdd";
import Spaces from "../containers/Spaces/index";
import AddWorkspace from "../containers/WorkspaceAdd/index";
import Projects from "../containers/Projects/index";
import AddProject from "../containers/ProjectAdd/index";
import Apps from "../containers/Apps/index";

import SettingsHome from "../containers/Settings/SettingsHome";
import BilingHome from "../pages/Billing";

import CollectionTypesList from "../containers/collection_definition/CollectionTypesList";
import { CollectionTypeAdd } from "../containers/collection_definition/CollectionTypeAdd";
import { CollectionTypeConfView } from "../containers/collection_definition/CollectionTypeConfView";
import { CollectionTypeAddFieldSet } from "../containers/collection_definition/CollectionTypeAddFieldSet";

import { FilesListing } from "../containers/files/FilesListing";
import { FilesRecycleBin } from "../containers/files/FilesRecycleBin";
import { SharedFilesListing } from "../containers/files/SharedFilesListing";
import { FileUpload } from "../containers/files/FileUpload";
import { CollectionsLayout } from "../containers/collection_item/CollectionsLayout";

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

    // Collection Definitions
    {
        path: '/workspace/:space_id/project/:project_id/collection-types',
        element: <CollectionTypesList />,
        component: 'collection_types'
    },
    {
        path: '/workspace/:space_id/project/:project_id/collection-types/add',
        element: <CollectionTypeAdd />,
        component: 'collection_types'
    },
    {
        path: '/workspace/:space_id/project/:project_id/collection-types/edit',
        element: <CollectionTypeAdd />,
        component: 'collection_types'
    },
    {
        path: '/workspace/:space_id/project/:project_id/collection-types/add/configure',
        element: <CollectionTypeConfView />,
        component: 'collection_types'
    },
    {
        path: '/workspace/:space_id/project/:project_id/collection-types/edit/configure',
        element: <CollectionTypeConfView />,
        component: 'collection_types'
    },

    // Collection Fieldset
    {
        path: '/workspace/:space_id/project/:project_id/collection-types/field-set/add',
        element: <CollectionTypeAddFieldSet />,
        component: 'collection_types'
    },
    {
        path: '/workspace/:space_id/project/:project_id/collection-types/field-set/edit',
        element: <CollectionTypeAddFieldSet />,
        component: 'collection_types'
    },
    {
        path: '/workspace/:space_id/project/:project_id/collection-types/field-set/edit/configure',
        element: <CollectionTypeConfView />,
        component: 'collection_types'
    },
    {
        path: '/workspace/:space_id/project/:project_id/collection-types/field-set/add/configure',
        element: <CollectionTypeConfView />,
        component: 'collection_types'
    },

    // Collection Items
    {
        path: '/workspace/:space_id/project/:project_id/collections',
        element: <CollectionsLayout />,
        component: 'collections'
    },
    {
        path: '/workspace/:space_id/project/:project_id/collections/:collection_id',
        element: <CollectionsLayout />,
        component: 'collections'
    },

    // Media Files
    {
        path: '/workspace/:space_id/project/:project_id/files',
        element: <FilesListing />,
        component: 'files'
    },
    {
        path: '/workspace/:space_id/project/:project_id/files/*',
        element: <FilesListing />,
        component: 'files'
    },
    {
        path: '/workspace/:space_id/project/:project_id/files/recyclebin',
        element: <FilesRecycleBin />,
        component: 'files'
    },
    {
        path: '/workspace/:space_id/project/:project_id/files/shared-with-me',
        element: <SharedFilesListing />,
        component: 'files'
    },
    {
        path: '/workspace/:space_id/project/:project_id/files/upload',
        element: <FileUpload />,
        component: 'files'
    },
    {
        path: '/spaces/:space_id/projects/:project_id/files/:folder_id/upload',
        element: <FileUpload />,
        component: 'files'
    },

    //Others 
    {
        path: '/apps',
        element: <Apps />,
        component: 'apps'
    },

    {
        path: '/settings/*',
        element: <SettingsHome />,
        component: 'settings'
    },
    {
        path: '/user/billing',
        element: <BilingHome />,
        component: 'Users'
    }

];