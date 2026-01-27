import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { Box, Button, FormControl, TextField, Typography } from '@mui/material'

import { getStyles } from './styles';
import { getComponentsStyles } from '../../../styles/componentsStyles';
import { buttonStyles } from '../../../styles/buttonStyles';
import { AlertMessages } from '../../../utils/AlertMessages'
import { tostAlert } from '../../../utils/AlertToast'
import LoadBar from '../../../utils/LoadBar'
import ProjectsApi from '../../../Api/Services/AppflyteBackend/ProjectsApi'
import { useAppContext } from '../../../context/AppContext';
import { setProjectAdded } from '../../../Redux/slice/newDataSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function GeneralSettings() {
  const theme = useTheme();
  const styles = getStyles(theme);
  const componentsStyles = getComponentsStyles(theme);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { selectedOrganization, selectedProject, selectedWorkspace, setSelectedProject } = useAppContext();

  const [loading, setLoading] = useState(true);
  const [formErrors, setFormErrors] = useState({});
  const [settings, setSettings] = useState({ projectName: '', projectDescription: '' });

  useEffect(() => {
    const project_name = selectedProject?.payload?.name;
    const project_description = selectedProject?.payload?.description;
    setSettings({ ...settings, projectName: project_name, projectDescription: project_description })
    setLoading(false)
  }, [])

  useEffect(() => {
    const errors = { ...formErrors };
    if (formErrors?.projectName && settings?.projectName?.trim()) { delete errors?.projectName }
    if (formErrors?.projectDescription && settings?.projectDescription?.trim()) { delete errors?.projectDescription }
    if (JSON.stringify(errors) !== JSON.stringify(formErrors)) { setFormErrors(errors) }
  }, [settings, formErrors]);

  const handleSave = async () => {
    setLoading(true)
    try {

      const errors = {};
      if (!settings?.projectName?.trim()) { errors.projectName = 'This Field is required' }
      if (!settings?.projectDescription?.trim()) { errors.projectDescription = 'This Field is required' }
      if (Object.keys(errors).length === 0) {

        const project_id = selectedProject?.payload?.__auto_id__;
        const project_update_key = selectedProject?.update_key;
        const workspace_id = selectedWorkspace?.payload?.__auto_id__;
        const organization_id = selectedOrganization?.payload?.__auto_id__;

        const collection_data = await ProjectsApi.checkNameExistence(settings.projectName)
        if (collection_data.data && collection_data.data.published_collections_detail.length > 0) {
          const existing_data = collection_data.data.published_collections_detail.flatMap(collection => collection_data.data[collection.id]);

          if (existing_data?.length) {

            const filtered_data = existing_data.find(item =>
              item?.payload?.workspace?.includes(workspace_id) &&
              item?.payload?.name === settings.projectName &&
              item?.payload?.__auto_id__ !== project_id
            );
            if (filtered_data) {
              tostAlert('Project name already exists', 'warning');
              return;
            }
          }
        }

        const EditProjectObject = {
          id: project_id,
          fields: [
            {
              "path": '$.name',
              "value": settings.projectName
            },
            {
              "path": '$.description',
              "value": settings.projectDescription
            }
          ]
        }
        const response = await ProjectsApi.updateProject(JSON.stringify(EditProjectObject), project_id, project_update_key)
        if (response.status === 200) {
          const message = await AlertMessages('update', 'project');
          tostAlert(message, 'success')
          dispatch(setProjectAdded(true))
          setSelectedProject(null)
          navigate(`/organization/${organization_id}/workspace/${workspace_id}/projects`)
        } else {
          const message = await AlertMessages('error', 'project');
          tostAlert(message, 'error')
        }
      }
      else {
        setFormErrors(errors);
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box sx={styles.mainContainer}>
      <Box sx={styles.cardContainer}>

        {loading && (<LoadBar />)}

        <Box display={'flex'} alignItems={'center'} justifyContent={'space-between'}>
          <Typography sx={styles.mainHeadingText}>General Settings</Typography>
          <Box display={'flex'} alignItems={'center'}>
            <Button
              sx={{ ...buttonStyles.primaryBtn, width: '100px' }}
              disabled={selectedProject === null || loading}
              onClick={handleSave}
            >
              <Typography sx={styles.btnText}>SAVE</Typography>
            </Button>
            <Button sx={{ ...buttonStyles.secondaryBtn, width: '100px', marginLeft: '10px' }}>
              <Typography sx={styles.btnText}>CANCEL</Typography>
            </Button>
          </Box>
        </Box>

        <Typography sx={{ ...styles.paraText, marginTop: '10px' }}>
          Configure you app name and icon
        </Typography>

        <Box marginTop={'20px'}>
          <Box>
            <FormControl>
              <Typography sx={{ ...styles.paraText, marginBottom: '6px' }}>Project Name <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                id="project-name"
                placeholder='Project Name'
                size='small'
                sx={{ ...componentsStyles.textField, width: '600px' }}
                name="project_name"
                value={settings.projectName}
                onChange={(e) => setSettings({ ...settings, projectName: e.target.value })}
              />
            </FormControl>
            {formErrors.projectName && <Typography sx={{ ...styles.paraText, color: 'red' }}>{formErrors.projectName}</Typography>}
          </Box>
          <Box>
            <FormControl sx={{ marginTop: '20px' }}>
              <Typography sx={{ ...styles.paraText, marginBottom: '6px' }}>Project Description  <span style={{ color: 'red' }}>*</span></Typography>
              <TextField
                id="project-descriptions"
                placeholder='Description'
                size='medium'
                sx={{ ...componentsStyles.textField, width: '600px' }}
                name="project_descriptions"
                value={settings.projectDescription}
                onChange={(e) => setSettings({ ...settings, projectDescription: e.target.value })}
              />
            </FormControl>
            {formErrors.projectDescription && <Typography sx={{ ...styles.paraText, color: 'red' }}>{formErrors.projectDescription}</Typography>}
          </Box>
        </Box>

      </Box>
    </Box>
  )
}

export default GeneralSettings