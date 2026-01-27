import React, { useEffect, useState } from 'react';
import { Box, CircularProgress } from '@mui/material'
import AmeyaExtraction from "ameya-extraction";
import "./styles.css";
import { getAgentApiToken } from '../../utils/GetAccountDetails';
import { useAppContext } from '../../context/AppContext';

function ExtractionLaunch(props) {

    const { document_type_id, file_id, setLayoutPreview } = props;
    const { selectedOrganization, selectedProject } = useAppContext();
    const [loading, setLoading] = useState(false)
    const [agentTokenId, setAgentTokenId] = useState(null);
    const [datasetEnabled, setDatasetEnabled] = useState(true);

    const handleOnCancel = () => {
        setLayoutPreview(false)
    }

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true)
        try {
            await Promise.all([fetchToken()
                // fetchSettings()
            ]
            )
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const fetchToken = async () => {
        try {
            const token = await getAgentApiToken();
            setAgentTokenId(token);
        } catch (error) {
            console.log(error)
        }
    };

    const appflyte_backend_url = process.env.REACT_APP_APPFLYTE_BACKEND_URL
    const appflyte_project_id = selectedProject?.payload?.__auto_id__;
    const appflyte_organization_id = selectedOrganization?.payload?.__auto_id__;

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', width: '100%', bgcolor: '#FFFFFF' }}>
                <CircularProgress sx={{ color: '#007bff' }} />
            </Box>)
    }

    if (!agentTokenId) {
        return (<Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', color: 'red', backgroundColor: '#FFFFFF' }}>
            No token available. Please try again.
        </Box>)
    }

    const theme = {
        palette: {
            mode: 'light',
            primary: {
                main: '#F3F5F7',
            },
            secondary: {
                main: '#ffffff',
            },
            background: {
                default: '#F3F5F7',
                paper: '#ffffff',
            },
            text: {
                primary: '#000000'
            },
        },
        customColors: {
            button: {
                primary: '#0B51C5',
                secondary: '#DEDEDE',
                ternary: '#000000',
            },
            ternary: {
                main: '#DEDEDE',
                contrastText: '#000',
            },
        },
        typography: {
            fontFamily: 'Inter',
        },
    };


    return (
        <Box className="extraction-config-wrapper">
            <AmeyaExtraction
                theme={theme}
                appflyte_backend_url={appflyte_backend_url}
                appflyte_agent_api_token={agentTokenId}
                appflyte_organization_id={appflyte_organization_id}
                appflyte_project_id={appflyte_project_id}

                extraction_document_type_id={document_type_id}
                extraction_file_id={file_id}
                onCancel={handleOnCancel}
            />
        </Box >
    )
}

export default ExtractionLaunch;