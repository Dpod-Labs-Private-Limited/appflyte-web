/**
 *
 * ManageFolderAndFileAccess
 *
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio, LinearProgress } from '@mui/material'; // Updated import for MUI v5
import GalleryService from '../../Api/Services/files/galleryService';
import { FILE_ACCESS_PUBLIC, FILE_ACCESS_PRIVATE, FILE_ACCESS_SUBSCRIPTION } from '../../utils/constants';
import styles from './styles';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { useSelector } from 'react-redux';

function ManageFolderAndFileAccess(props) {
  const { handleClose, selectedUser, selectedEntity, tostAlert, parentRootId, fetchFilesAndFolders, isFolder } = props;

  const [value, setValue] = useState(selectedEntity?.access_type ?? FILE_ACCESS_PUBLIC);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const selected_space = useSelector(state => state.current_selected_data.selected_space)
  const selected_project = useSelector(state => state.current_selected_data.selected_project)

  // Assuming styles is an object of styles to be applied using sx prop
  const { modal, addObjectiveHeading, cancelBtn, saveBtn, mediumLabel } = styles;

  const apiErrorHandler = (err) => {
    if (err.response && err.response.data) {
      if (err.response.data === null) {
        setError(<FormattedMessage {...messages.someErrOccrd} />);
      } else if ("schema_errors" in err.response.data) {
        setError(<FormattedMessage {...messages.invalidInput} />);
      } else if ("message" in err.response.data) {
        setError(err.response.data.message);
      } else {
        setError(<FormattedMessage {...messages.someErrOccrd} />);
      }
    } else {
      if (err.message === "Network Error") {
        setError(<FormattedMessage {...messages.serverError} />);
      }
    }
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null); // Reset error before starting the request

    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const schemaId = selected_project.payload.__auto_id__

    const resObj = isFolder
      ? {
        folder_name: selectedEntity.entityName,
        access_type: value,
        can_be_subscribed: selectedEntity.can_be_subscribed,
        parent_folder_id: parentRootId,
      }
      : {
        access_type: value,
        file_attributes: selectedEntity.entityMetaData,
        file_type: selectedEntity.entitySubType,
      };

    const fnc = isFolder
      ? GalleryService.modifyFolder(accID, subscriberId, subscriptionId, schemaId, selectedEntity.entityId, resObj)
      : GalleryService.modifyFiles(accID, subscriberId, subscriptionId, schemaId, selectedEntity.entityId, resObj);

    try {
      const res = await fnc;
      tostAlert(<FormattedMessage {...messages.accessChanged} />, "success");
      fetchFilesAndFolders(parentRootId);
      handleClose();
    } catch (err) {
      console.error(err);
      apiErrorHandler(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedEntity?.access_type) {
      setValue(selectedEntity.access_type);
    }
  }, [selectedEntity]);

  const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  return (
    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: 600,
      bgcolor: 'background.paper',
      boxShadow: 24,
      p: 3,
      borderRadius: 2,
    }}>
      <Box px="20px" py="15px" display="flex" justifyContent="space-between">
        <Box>
          <Typography sx={addObjectiveHeading}>
            <FormattedMessage {...messages.heading} />
          </Typography>
        </Box>
        <Box>
          <Button
            size="small"
            disableElevation
            variant="contained"
            sx={cancelBtn}
            onClick={handleClose}
          >
            <FormattedMessage {...messages.cancelBtn} />
          </Button>
          <Button
            disableElevation
            size="small"
            variant="contained"
            color="secondary"
            sx={saveBtn}
            onClick={handleSubmit}
          >
            <FormattedMessage {...messages.saveBtn} />
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ width: '100%' }} />}

      {error && (
        <Box px="20px" py="15px">
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      <Box display="flex" width="100%" justifyContent="center" px="20px" py="15px">
        <RadioGroup
          aria-label="access"
          size="small"
          name="access"
          row
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            classes={{ label: mediumLabel }}
            value={FILE_ACCESS_PRIVATE}
            control={<Radio size="small" />}
            label={<FormattedMessage {...messages.private} />}
          />
          <FormControlLabel
            classes={{ label: mediumLabel }}
            value={FILE_ACCESS_PUBLIC}
            control={<Radio size="small" />}
            label={<FormattedMessage {...messages.public} />}
          />
          <FormControlLabel
            classes={{ label: mediumLabel }}
            value={FILE_ACCESS_SUBSCRIPTION}
            control={<Radio size="small" />}
            label={<FormattedMessage {...messages.reqSubscription} />}
          />
        </RadioGroup>
      </Box>
    </Box>
  );
}

ManageFolderAndFileAccess.propTypes = {};

export default ManageFolderAndFileAccess;
