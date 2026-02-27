import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { useIntl } from 'react-intl';
import messages from './messages';

import { Box, Button, TextField, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getComponentsStyles } from '../../styles/componentsStyles';
import { getStyles } from './styles';
import { buttonStyles } from '../../styles/buttonStyles';

import LoadBar from '../../utils/LoadBar';
import { tostAlert } from '../../utils/AlertToast';
import { AlertMessages } from '../../utils/AlertMessages';
import { apiErrorHandler } from '../../utils/ApiErrorHandler';

import { setProjectAdded } from "../../Redux/slice/newDataSlice";
import { setAppflyteEngineState } from "../../Redux/slice/dataSlice";
import ProjectsApi from '../../Api/Services/AppflyteBackend/ProjectsApi';
import getAppflyteEnginesData from '../../utils/ApiFunctions/AppflyteEngines';
import { getUserItemId, getUserName } from '../../utils/GetAccountDetails';
import { useAppContext } from '../../context/AppContext';
import { checkCredit } from '../../utils';
import { useCredit } from '../../context/CreditContext';

function AddProject() {

    const theme = useTheme();
    const styles = getStyles(theme);
    const intl = useIntl();
    const componentsStyles = getComponentsStyles(theme);
    const { selectedOrganization, selectedService, selectedWorkspace } = useAppContext();

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { action } = useParams();
    const location = useLocation()
    const { credit } = useCredit();

    const [loading, setLoading] = useState(false)
    const [appflyteEngines, setAppflyteEngines] = useState([]);

    const projectDetails = {
        projectName: '',
        projectDescription: '',
        projectId: null,
        projectUpdateKey: ''
    }
    const [projectData, setProjectData] = useState(projectDetails);
    const [formErrors, setFormErrors] = useState({});

    const all_engines = useSelector(state => state.all_data.appflyte_engines);

    useEffect(() => {

        const organization_id = selectedOrganization?.payload?.__auto_id__;
        const workspace_id = selectedWorkspace?.payload?.__auto_id__;

        const validateCredit = async () => {
            const result = await checkCredit(credit);
            if (result) {
                navigate(`/organization/${organization_id}/workspace/${workspace_id}/projects`);
            }
        };
        validateCredit();

        if (action !== "add-project" && action !== "edit-project") {
            navigate(`/organization/${organization_id}/workspace/${workspace_id}/projects`);
        }
        if (action === "edit-project") {
            const selected_project_id = location?.state?.selected_project_id ?? null;
            if (!selected_project_id) {
                navigate(`/organization/${organization_id}/workspace/${workspace_id}/projects`);
            }
            const selected_project_update_key = location?.state?.selected_project_update_key ?? null;
            const selected_project_name = location?.state?.selected_project_name ?? null;
            const selected_project_description = location?.state?.selected_project_description ?? null;
            setProjectData({
                ...projectData,
                projectName: selected_project_name,
                projectDescription: selected_project_description,
                projectId: selected_project_id,
                projectUpdateKey: selected_project_update_key
            })
        }
    }, [action, selectedOrganization, selectedWorkspace, navigate, location, credit]);

    useEffect(() => {
        getEngineData();
        //eslint-disable-next-line
    }, [])

    const getEngineData = async () => {
        setLoading(true)
        try {
            let response = []
            if (all_engines?.length > 0) {
                response = all_engines
            } else {
                response = await getAppflyteEnginesData()
                dispatch(setAppflyteEngineState(response))
            }
            setAppflyteEngines(response)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const errors = { ...formErrors };
        if (formErrors?.projectName && projectData?.projectName?.trim()) { delete errors?.projectName }
        if (formErrors?.projectDescription && projectData?.projectDescription?.trim()) { delete errors?.projectDescription }
        if (JSON.stringify(errors) !== JSON.stringify(formErrors)) { setFormErrors(errors) }
    }, [projectData, formErrors]);

    const handleCreateProject = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const errors = {};
            if (!projectData?.projectName?.trim()) { errors.projectName = 'This field is required' }
            if (!projectData?.projectDescription?.trim()) { errors.projectDescription = 'This field is required' }

            if (Object.keys(errors).length === 0) {

                const engine_id = selectedService?.payload?.appflyte_engine?.at(-1) ?? null;
                const selected_engine = (appflyteEngines || [])?.find(item => item?.payload?.__auto_id__ === engine_id) ?? null;
                if (!selected_engine) {
                    tostAlert(intl.formatMessage(messages.service_error), 'warning');
                    return
                }

                const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
                const service_id = selectedService?.payload?.__auto_id__ ?? null;
                const engineConfig = selected_engine?.payload?.configuration ?? {};

                const collection_data = await ProjectsApi.checkNameExistence(projectData.projectName)
                if (collection_data.data && collection_data.data.published_collections_detail.length > 0) {
                    const existing_data = collection_data.data.published_collections_detail.flatMap(collection => collection_data.data[collection.id]);
                    if (existing_data) {
                        const filtered_data = existing_data?.find(item => item?.payload?.organization_id?.includes(organization_id) && item?.payload?.name === projectData.projectName) ?? null
                        if (filtered_data) {
                            tostAlert(intl.formatMessage(messages.project_check), 'warning')
                            return
                        }
                    }
                }

                const userId = await getUserItemId()
                const userName = getUserName()
                const workspace_id = selectedWorkspace?.payload?.__auto_id__ ?? null;

                const projectObject = {
                    collection_item: {
                        name: projectData.projectName,
                        description: projectData.projectDescription,
                        workspace: [workspace_id],
                        lookup_id: [engine_id],
                        organization_id: [organization_id],
                        service: [service_id],
                        configuration: engineConfig,
                        status: 'active',
                        created_by: userName,
                        user_id: userId,
                        created_on: moment().format("DD-MM-YYYY HH:mm:ss"),
                        history: [{
                            updated_by: userName,
                            status: "active",
                            updated_date: moment().format("DD-MM-YYYY HH:mm:ss")
                        }],
                    }
                }
                const response = await ProjectsApi.createProject(JSON.stringify(projectObject));
                if (response.status === 200) {
                    setProjectData(projectDetails)
                    dispatch(setProjectAdded(true))
                    navigate(`/organization/${organization_id}/workspace/${workspace_id}/projects`)
                    tostAlert(intl.formatMessage(messages.project_add), 'success')
                } else {
                    tostAlert(intl.formatMessage(messages.project_add_error), 'error')
                }
            }
            else {
                setFormErrors(errors);
            }
        } catch (error) {
            apiErrorHandler(error);
            console.error("Error creating workspace:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleSave = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const errors = {};
            if (!projectData?.projectName?.trim()) { errors.projectName = 'This field is required' }
            if (!projectData?.projectDescription?.trim()) { errors.projectDescription = 'This field is required' }

            if (Object.keys(errors).length === 0) {

                const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;

                const collection_data = await ProjectsApi.checkNameExistence(projectData.projectName)
                if (collection_data.data && collection_data.data.published_collections_detail.length > 0) {
                    const existing_data = collection_data.data.published_collections_detail.flatMap(collection => collection_data.data[collection.id]);

                    if (existing_data?.length) {
                        const filtered_data = existing_data.find(item =>
                            item?.payload?.organization_id?.includes(organization_id) &&
                            item?.payload?.name === projectData.projectName &&
                            item?.payload?.__auto_id__ !== projectData.projectId
                        );
                        if (filtered_data) {
                            tostAlert(intl.formatMessage(messages.project_check), 'warning');
                            return;
                        }
                    }
                }

                const workspace_id = selectedWorkspace?.payload?.__auto_id__ ?? null;

                const EditProjectObject = {
                    id: projectData.projectId,
                    fields: [
                        {
                            "path": '$.name',
                            "value": projectData.projectName
                        },
                        {
                            "path": '$.description',
                            "value": projectData.projectDescription
                        }
                    ]
                }
                const response = await ProjectsApi.updateProject(JSON.stringify(EditProjectObject), projectData.projectId, projectData.projectUpdateKey);
                if (response.status === 200) {
                    setProjectData(projectDetails)
                    dispatch(setProjectAdded(true))
                    navigate(`/organization/${organization_id}/workspace/${workspace_id}/projects`)
                    tostAlert(intl.formatMessage(messages.project_update), 'success')
                } else {
                    tostAlert(intl.formatMessage(messages.project_update_error), 'error')
                }
            }
            else {
                setFormErrors(errors);
            }
        } catch (error) {
            apiErrorHandler(error);
            console.error("Error creating workspace:", error);
        } finally {
            setLoading(false);
        }
    }

    const handleCancel = () => {
        const workspace_id = selectedWorkspace?.payload?.__auto_id__ ?? null;
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        navigate(`/organization/${organization_id}/workspace/${workspace_id}/projects`)
    }

    return (
        <div style={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                {loading && (<LoadBar />)}
                <Box padding={'20px'}>

                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>

                        <Typography sx={styles.mainHeadingText}>{action === "add-project" ? 'Create Project' : 'Edit Project'}</Typography>

                        <Box display={'flex'} alignItems={'center'}>

                            <Button
                                sx={{ ...buttonStyles.primaryBtn, width: '110px' }}
                                disabled={loading}
                                onClick={(e) => action === "add-project" ? handleCreateProject(e) : handleSave(e)}
                            >
                                <Typography sx={styles.btnText}>{action === "add-project" ? 'CREATE' : 'SAVE'}</Typography>
                            </Button>

                            <Button
                                sx={{ ...buttonStyles.secondaryBtn, width: '110px', marginLeft: '10px' }}
                                onClick={handleCancel}>
                                <Typography sx={styles.btnText}>CANCEL</Typography>
                            </Button>

                        </Box>

                    </Box>

                    <Box marginTop={'20px'}>
                        <Box>
                            <TextField
                                id="project-name"
                                variant="outlined"
                                placeholder='Project Name'
                                size='small'
                                sx={{ ...componentsStyles.textField, width: '40%' }}
                                value={projectData.projectName}
                                onChange={(e) => setProjectData({ ...projectData, projectName: e.target.value })}
                            />
                            {formErrors.projectName && <Typography sx={styles.errorText}>{formErrors.projectName}</Typography>}
                        </Box>
                        <Box marginTop={'20px'}>
                            <TextField
                                id="project-description"
                                variant="outlined"
                                placeholder='Project Description'
                                size='medium'
                                sx={{ ...componentsStyles.textField, width: '40%' }}
                                value={projectData.projectDescription}
                                onChange={(e) => setProjectData({ ...projectData, projectDescription: e.target.value })}
                            />
                            {formErrors.projectDescription && <Typography sx={styles.errorText}>{formErrors.projectDescription}</Typography>}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div >
    )
}

export default AddProject;