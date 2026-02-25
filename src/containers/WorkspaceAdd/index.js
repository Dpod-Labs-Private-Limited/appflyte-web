import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import { useIntl } from 'react-intl';
import messages from './messages';

import { useTheme } from '@mui/material/styles';
import { getComponentsStyles } from '../../styles/componentsStyles';
import { getStyles } from './styles';

import { fontStyles } from '../../styles/fontStyles';
import { buttonStyles } from '../../styles/buttonStyles';
import { Box, Button, TextField, Typography } from '@mui/material';

import LoadBar from '../../utils/LoadBar';
import { tostAlert } from '../../utils/AlertToast';
import { AlertMessages } from '../../utils/AlertMessages';
import { apiErrorHandler } from '../../utils/ApiErrorHandler';

import { setWorkspaceAdded } from "../../Redux/slice/newDataSlice";
import WorkspaceApi from '../../Api/Services/AppflyteBackend/WorkspaceApi';
import { getUserName } from '../../utils/GetAccountDetails';
import { useAppContext } from '../../context/AppContext';
import { getServicesById } from '../../utils/ApiFunctions/ServicesData';
import { checkCredit } from '../../utils';
import { useCredit } from '../../context/CreditContext';

function AddWorkspace() {
    const theme = useTheme();
    const styles = getStyles(theme);
    const intl = useIntl();
    const componentsStyles = getComponentsStyles(theme);

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { action } = useParams();
    const location = useLocation()
    const { credit } = useCredit();

    const spaceDetails = {
        spaceName: '',
        spaceDescription: '',
        spaceId: null,
        spaceUpdateKey: ''
    }
    const [spaceData, setSpaceData] = useState(spaceDetails);
    const [serviceId, setServiceId] = useState({});
    const [loading, setLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { selectedOrganization, selectedService } = useAppContext();

    useEffect(() => {

        const validateCredit = async () => {
            const result = await checkCredit(credit);
            if (result) {
                navigate(`/organization/${organization_id}/workspaces`)
            }
        };
        validateCredit();

        const organization_id = selectedOrganization?.payload?.__auto_id__;

        if (action !== "add-space" && action !== "edit-space") {
            navigate(`/organization/${organization_id}/workspaces`)
        }
        if (action === "edit-space") {
            const selected_space_id = location?.state?.selected_space_id ?? null;
            if (!selected_space_id) {
                navigate(`/organization/${organization_id}/workspaces`)
            }
            const selected_space_update_key = location?.state?.selected_space_update_key ?? null;
            const selected_space_name = location?.state?.selected_space_name ?? null;
            const selected_space_description = location?.state?.selected_space_description ?? null;
            setSpaceData({
                ...spaceData,
                spaceName: selected_space_name,
                spaceDescription: selected_space_description,
                spaceId: selected_space_id,
                spaceUpdateKey: selected_space_update_key
            })
        }
    }, [action, selectedOrganization, navigate, location, credit]);

    useEffect(() => {
        fetchServices()
    }, [])

    const fetchServices = async () => {
        setLoading(true)
        try {
            const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
            const service_id = selectedService?.payload?.__auto_id__ ?? null
            const response = await getServicesById(service_id);
            if (!response) {
                navigate(`/organization/${organization_id}/services`);
            }
            const service = response?.payload?.__auto_id__ || '';
            setServiceId(service)
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = () => {
        const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;
        navigate(`/organization/${organization_id}/workspaces`)
    }

    useEffect(() => {
        const errors = { ...formErrors };
        if (formErrors?.spaceName && spaceData?.spaceName.trim()) { delete errors?.spaceName }
        if (formErrors?.spaceDescription && spaceData?.spaceDescription.trim()) { delete errors?.spaceDescription }
        if (JSON.stringify(errors) !== JSON.stringify(formErrors)) { setFormErrors(errors) }
    }, [spaceData, formErrors]);

    const handleCreateSpace = async (e) => {
        setLoading(true);
        e.preventDefault();
        try {
            const errors = {};
            if (!spaceData.spaceName.trim()) { errors.spaceName = 'This field is required' }
            if (!spaceData.spaceDescription.trim()) { errors.spaceDescription = 'This field is required' }
            if (Object.keys(errors).length === 0) {

                const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;

                const collection_data = await WorkspaceApi.checkNameExistence(spaceData.spaceName)
                if (collection_data.data && collection_data.data.published_collections_detail.length > 0) {
                    const existing_data = collection_data.data.published_collections_detail.flatMap(collection => collection_data.data[collection.id]);
                    if (existing_data) {
                        const filtered_data = existing_data?.find(item => item?.payload?.organization_id?.includes(organization_id) && item?.payload?.name === spaceData.spaceName) ?? null
                        if (filtered_data) {
                            tostAlert(intl.formatMessage(messages.workspace_check), 'warning')
                            return
                        }
                    }
                }

                const userName = getUserName()
                const spaceObject = {
                    collection_item: {
                        name: spaceData.spaceName,
                        description: spaceData.spaceDescription,
                        status: 'active',
                        created_by: userName,
                        service: [serviceId],
                        organization_id: [organization_id],
                        created_on: moment().format("DD-MM-YYYY HH:mm:ss"),
                        history: [
                            {
                                updated_by: userName,
                                status: "active",
                                updated_date: moment().format("DD-MM-YYYY HH:mm:ss")
                            }
                        ],
                    }
                }
                const response = await WorkspaceApi.createWorkspace(JSON.stringify(spaceObject));
                if (response.status === 200) {
                    setSpaceData(spaceDetails)
                    dispatch(setWorkspaceAdded(true))
                    navigate(`/organization/${organization_id}/workspaces`)
                    tostAlert(intl.formatMessage(messages.workspace_add), 'success')
                } else {
                    tostAlert(intl.formatMessage(messages.workspace_add_error), 'error')
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

            if (!spaceData.spaceName.trim()) { errors.spaceName = 'This field is required' }
            if (!spaceData.spaceDescription.trim()) { errors.spaceDescription = 'This field is required' }

            if (Object.keys(errors).length === 0) {

                const organization_id = selectedOrganization?.payload?.__auto_id__ ?? null;

                const collection_data = await WorkspaceApi.checkNameExistence(spaceData.spaceName)
                if (collection_data.data && collection_data.data.published_collections_detail.length > 0) {
                    const existing_data = collection_data.data.published_collections_detail.flatMap(collection => collection_data.data[collection.id]);

                    if (existing_data?.length) {
                        const filtered_data = existing_data.find(item =>
                            item?.payload?.organization_id?.includes(organization_id) &&
                            item?.payload?.name === spaceData.spaceName &&
                            item?.payload?.__auto_id__ !== spaceData.spaceId
                        );
                        if (filtered_data) {
                            tostAlert(intl.formatMessage(messages.workspace_check), 'warning')
                            return;
                        }
                    }
                }

                const EditSpaceObject = {
                    id: spaceData.spaceId,
                    fields: [
                        {
                            "path": '$.name',
                            "value": spaceData.spaceName
                        },
                        {
                            "path": '$.description',
                            "value": spaceData.spaceDescription
                        }
                    ]
                }
                const response = await WorkspaceApi.updateSpace(JSON.stringify(EditSpaceObject), spaceData.spaceId, spaceData.spaceUpdateKey);
                if (response.status === 200) {
                    setSpaceData(spaceDetails)
                    dispatch(setWorkspaceAdded(true))
                    tostAlert(intl.formatMessage(messages.workspace_update), 'success')
                    navigate(`/organization/${organization_id}/workspaces`)
                } else {
                    tostAlert(intl.formatMessage(messages.workspace_update_error), 'error')
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

    return (
        <div style={styles.mainContainer}>
            <Box sx={styles.cardContainer}>
                {loading && (<LoadBar />)}

                <Box padding={'20px'}>

                    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
                        <Typography sx={styles.mainHeadingText}>{action === "add-space" ? 'Create Space' : 'Edit Space'}</Typography>

                        <Box display={'flex'} alignItems={'center'}>
                            <Button
                                disabled={loading}
                                sx={{ ...buttonStyles.primaryBtn, width: '110px' }}
                                onClick={(e) => action === "add-space" ? handleCreateSpace(e) : handleSave(e)}
                            >
                                <Typography sx={styles.btnText}>{action === "add-space" ? 'CREATE' : 'SAVE'}</Typography>
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
                                id="space-name"
                                variant="outlined"
                                placeholder='Space Name'
                                size='small'
                                sx={{ ...componentsStyles.textField, width: '40%' }}
                                value={spaceData.spaceName}
                                onChange={(e) => setSpaceData({ ...spaceData, spaceName: e.target.value })}
                            />
                            {formErrors.spaceName && <Typography sx={styles.errorText}>{formErrors.spaceName}</Typography>}
                        </Box>
                        <Box marginTop={'20px'}>
                            <TextField
                                id="spaces-description"
                                variant="outlined"
                                placeholder='Spaces Description'
                                size='medium'
                                sx={{ ...componentsStyles.textField, width: '40%' }}
                                value={spaceData.spaceDescription}
                                onChange={(e) => setSpaceData({ ...spaceData, spaceDescription: e.target.value })}
                            />
                            {formErrors.spaceDescription && <Typography sx={styles.errorText}>{formErrors.spaceDescription}</Typography>}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </div >
    )
}

export default AddWorkspace;