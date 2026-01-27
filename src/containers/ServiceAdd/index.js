import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useIntl } from 'react-intl';
import messages from './messages';

import { Avatar, Box, Button, IconButton, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { KeyboardArrowDown } from '@mui/icons-material';
import { getStyles } from './styles';

import { getUserName } from '../../utils/GetAccountDetails';
import { setAppflyteEngineState } from '../../Redux/slice/dataSlice';
import { setProjectAdded, setServiceAdded, setWorkspaceAdded } from '../../Redux/slice/newDataSlice';

import getAppflyteEnginesData from '../../utils/ApiFunctions/AppflyteEngines';
import ServicesApi from '../../Api/Services/AppflyteBackend/ServicesApi';
import { tostAlert } from '../../utils/AlertToast';
import WorkspaceApi from '../../Api/Services/AppflyteBackend/WorkspaceApi';
import ProjectsApi from '../../Api/Services/AppflyteBackend/ProjectsApi';
import LoadBar from '../../utils/LoadBar';
import { useAppContext } from '../../context/AppContext';

function ServiceAdd() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();
    const intl = useIntl();
    const [formErrors, setFormErrors] = useState({});
    const engine_type = location.state.engine_type ?? null;
    const service_name = location.state.service_name ?? null;
    const { selectedOrganization, setSelectedService } = useAppContext();

    const all_engines = useSelector(state => state.all_data.appflyte_engines);

    const [loading, setLoading] = useState(true);
    const [dataType, setDataType] = useState(1);
    const spaceProjectDetails = {
        spaceName: '',
        spaceDescription: '',
        projectName: '',
        projectDescription: '',
    }
    const [spaceProjectData, setSpaceProjectData] = useState(spaceProjectDetails);
    const [appflyteEngines, setAppflyteEngines] = useState([]);

    useEffect(() => {
        if (!selectedOrganization) {
            navigate('/')
        }
        if (!engine_type || !service_name) {
            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
            navigate(`/organization/${organization_id}/services`)
        }
        fetchAllData()
    }, [location])

    useEffect(() => {
        const errors = { ...formErrors };
        if (formErrors?.spaceName && spaceProjectData?.spaceName.trim()) { delete errors?.spaceName }
        if (formErrors?.spaceDescription && spaceProjectData?.spaceDescription.trim()) { delete errors?.spaceDescription }
        if (formErrors?.projectName && spaceProjectData?.projectName.trim()) { delete errors?.projectName }
        if (formErrors?.projectDescription && spaceProjectData?.projectDescription.trim()) { delete errors?.projectDescription }
        if (JSON.stringify(errors) !== JSON.stringify(formErrors)) { setFormErrors(errors) }
    }, [spaceProjectData, formErrors]);

    const fetchAllData = async () => {
        try {
            if (!all_engines?.length) {
                const data = await getAppflyteEnginesData()
                dispatch(setAppflyteEngineState(data));
                setAppflyteEngines(data)
                return
            }
            setAppflyteEngines(all_engines)
        } catch (error) {
            console.error("Failed to fetch all data", error);
            return []
        } finally {
            setLoading(false)
        }
    };

    const hanldeNext = async () => {
        try {
            const errors = {};
            if (!spaceProjectData.spaceName.trim()) { errors.spaceName = 'This Field is required' }
            if (!spaceProjectData.spaceDescription.trim()) { errors.spaceDescription = 'This Field is required' }
            if (Object.keys(errors).length === 0) {
                setDataType(2)
            } else {
                setFormErrors(errors);
            }
        } catch (error) {
            console.log(error)
        }
    }

    const handleFinish = async () => {
        setLoading(true)
        try {
            const errors = {};
            if (!spaceProjectData.projectName.trim()) { errors.projectName = 'This Field is required' }
            if (!spaceProjectData.projectDescription.trim()) { errors.projectDescription = 'This Field is required' }
            if (Object.keys(errors).length === 0) {

                const filtered_engine = appflyteEngines.find(item => item?.payload?.__auto_id__ === engine_type) ?? null;
                const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;

                const service = await handleServiceCreation(filtered_engine, organization_id);
                const service_id = service?.payload?.__auto_id__ ?? null;
                if (!service) {
                    tostAlert(intl.formatMessage(messages.service_error), 'error')
                    return
                }

                const workspace = await handleSpaceCreation(service_id, organization_id)
                if (!workspace) {
                    tostAlert(intl.formatMessage(messages.workspace_error), 'error')
                    return
                }

                const project = await handleProjectCreation(filtered_engine, workspace, service_id, organization_id)
                if (!project) {
                    tostAlert(intl.formatMessage(messages.project_error), 'error')
                    return
                }

                tostAlert(intl.formatMessage(messages.service_success), 'success')
                setSelectedService(service)
                navigate(`/organization/${organization_id}/workspaces`)

            } else {
                setFormErrors(errors);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleServiceCreation = async (service_engine, organization_id) => {
        try {
            const engine_name = service_engine?.payload?.label ?? "";
            const engine_description = service_engine?.payload?.description ?? "";
            const engine_id = [service_engine?.payload?.__auto_id__] ?? [];

            const reqObj = {
                collection_item: {
                    name: engine_name,
                    description: engine_description,
                    appflyte_engine: engine_id,
                    organization_id: organization_id ? [organization_id] : [],
                    status: "__index__0",
                    start_date: moment().format("DD-MM-YYYY HH:mm:ss"),
                    credit_balance: "5"
                }
            }
            const response = await ServicesApi.createService(JSON.stringify(reqObj));
            if (response.status === 200) {
                dispatch(setServiceAdded(true))
                const responseData = response?.data ?? false
                return responseData
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const handleSpaceCreation = async (service, organization_id) => {
        try {
            const userName = getUserName()
            const spaceObject = {
                collection_item: {
                    name: spaceProjectData.spaceName,
                    description: spaceProjectData.spaceDescription,
                    status: 'active',
                    created_by: userName,
                    service: [service],
                    organization_id: organization_id ? [organization_id] : [],
                    created_on: moment().format("DD-MM-YYYY HH:mm:ss"),
                    history: [{
                        updated_by: userName,
                        status: "active",
                        updated_date: moment().format("DD-MM-YYYY HH:mm:ss")
                    }],
                }
            }
            const response = await WorkspaceApi.createWorkspace(JSON.stringify(spaceObject))
            if (response.status === 200) {
                dispatch(setWorkspaceAdded(true))
                const responseData = response?.data?.id ?? false
                return responseData
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const handleProjectCreation = async (filtered_engine, workspace, service, organization_id) => {
        try {
            const userName = getUserName();
            const engine_id = filtered_engine?.payload?.__auto_id__ ?? null;
            const engine_config = filtered_engine?.payload?.configuration ?? {};
            const projectObject = {
                collection_item: {
                    name: spaceProjectData.projectName,
                    description: spaceProjectData.projectDescription,
                    workspace: [workspace],
                    lookup_id: [engine_id],
                    organization_id: organization_id ? [organization_id] : [],
                    configuration: engine_config,
                    status: 'active',
                    created_by: userName,
                    service: [service],
                    created_on: moment().format("DD-MM-YYYY HH:mm:ss"),
                    history: [{
                        updated_by: userName,
                        status: "active",
                        updated_date: moment().format("DD-MM-YYYY HH:mm:ss")
                    }]
                }
            }
            const response = await ProjectsApi.createProject(JSON.stringify(projectObject))
            if (response.status === 200) {
                dispatch(setProjectAdded(true))
                return true
            }
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const handleCancel = () => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        navigate(`/organization/${organization_id}/services`)
    }

    const serviceDescriptions = {
        extraction_agent: "Organize your document types and documents using spaces and projects. Create your <br /> first space and project.",
        analytics_tool: "Organize your datasource and dataset using spaces and projects. Create your <br /> first space and project.",
        appflyte_agent: "Create your first space and project."
    };

    const description = serviceDescriptions[service_name] || "Select a service to see details.";
    const lines = description.split("<br />");

    return (
        <div style={styles.mainContainer}>
            <Box sx={styles.cardContainer}>

                {loading && (<LoadBar />)}

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: '60px', padding: '20px' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <Avatar
                                sx={{ bgcolor: dataType === 1 ? '#0B51C5' : '#000000', height: '32px', width: '32px', cursor: 'pointer' }}
                                alt="Remy Sharp"
                            >
                                1
                            </Avatar>
                            <Typography>Create Space</Typography>
                            {dataType === 1 && <IconButton>
                                <KeyboardArrowDown />
                            </IconButton>}
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                            <Avatar
                                sx={{ bgcolor: dataType === 2 ? '#0B51C5' : '#000000', height: '32px', width: '32px', cursor: 'pointer' }}
                                alt="Remy Sharp"
                            >
                                2
                            </Avatar>
                            <Typography>Create Project</Typography>
                            {dataType === 2 && <IconButton>
                                <KeyboardArrowDown />
                            </IconButton>}
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', gap: '10px' }}>
                        <Button
                            sx={styles.saveBtn}
                            disabled={loading}
                            onClick={() => dataType === 1 ? hanldeNext() : handleFinish()}
                        >
                            <Typography sx={styles.btnText}>{dataType === 1 ? 'NEXT' : 'FINISH'}</Typography>
                        </Button>
                        <Button
                            sx={styles.cancelBtn}
                            onClick={() => dataType === 1 ? handleCancel() : setDataType(1)}
                        >
                            <Typography sx={styles.btnText}>CANCEL</Typography>
                        </Button>
                    </Box>

                </Box>

                {dataType === 1 &&
                    (<Box paddingLeft={'20px'}>
                        <Box>
                            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                Create Space
                            </Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 400, marginTop: '7px' }}>
                                {lines.map((line, index) => (<span key={index}>{line.trim()}<br /></span>))}
                            </Typography>
                        </Box>
                        <Box marginTop={'20px'}>
                            <Box>
                                <Typography sx={{ fontSize: '14px', fontWeight: 400, marginBottom: '5px' }}>
                                    Space Name  <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    id="space-name"
                                    variant="outlined"
                                    placeholder='Space Name'
                                    size='small'
                                    sx={{ width: '40%' }}
                                    value={spaceProjectData.spaceName}
                                    onChange={(e) => setSpaceProjectData({ ...spaceProjectData, spaceName: e.target.value })}
                                />
                                {formErrors.spaceName && <Typography sx={styles.errorText}>{formErrors.spaceName}</Typography>}
                            </Box>
                            <Box marginTop={'20px'}>
                                <Typography sx={{ fontSize: '14px', fontWeight: 400, marginBottom: '5px' }}>
                                    Space Description <span style={{ color: 'red' }}>*</span>
                                </Typography>
                                <TextField
                                    id="spaces-description"
                                    variant="outlined"
                                    placeholder='Spaces Description'
                                    size='medium'
                                    sx={{ width: '40%' }}
                                    value={spaceProjectData.spaceDescription}
                                    onChange={(e) => setSpaceProjectData({ ...spaceProjectData, spaceDescription: e.target.value })}
                                />
                                {formErrors.spaceDescription && <Typography sx={styles.errorText}>{formErrors.spaceDescription}</Typography>}
                            </Box>
                        </Box>
                    </Box>)
                }

                {dataType === 2 &&
                    (<Box paddingLeft={'20px'}>
                        <Box>
                            <Typography sx={{ fontSize: '18px', fontWeight: 600 }}>
                                Create Project
                            </Typography>
                            <Typography sx={{ fontSize: '14px', fontWeight: 400, marginTop: '7px' }}>
                                {lines.map((line, index) => (<span key={index}>{line.trim()}<br /></span>))}
                            </Typography>
                        </Box>
                        <Box marginTop={'20px'}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 400, marginBottom: '5px' }}>
                                Project Name <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                id="app-name"
                                variant="outlined"
                                placeholder='Project Name'
                                size='small'
                                sx={{ width: '40%' }}
                                value={spaceProjectData.projectName}
                                onChange={(e) => setSpaceProjectData({ ...spaceProjectData, projectName: e.target.value })}
                            />
                            {formErrors.projectName && <Typography sx={styles.errorText}>{formErrors.projectName}</Typography>}
                        </Box>
                        <Box marginTop={'20px'}>
                            <Typography sx={{ fontSize: '14px', fontWeight: 400, marginBottom: '5px' }}>
                                Project Description <span style={{ color: 'red' }}>*</span>
                            </Typography>
                            <TextField
                                id="app-description"
                                variant="outlined"
                                placeholder='Project Description'
                                size='medium'
                                sx={{ width: '40%' }}
                                value={spaceProjectData.projectDescription}
                                onChange={(e) => setSpaceProjectData({ ...spaceProjectData, projectDescription: e.target.value })}
                            />
                            {formErrors.projectDescription && <Typography sx={styles.errorText}>{formErrors.projectDescription}</Typography>}
                        </Box>
                    </Box>)
                }
            </Box>
        </div >

    )
}

export default ServiceAdd;