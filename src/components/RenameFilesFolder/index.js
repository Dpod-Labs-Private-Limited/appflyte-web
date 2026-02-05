import React, { useState } from 'react';
import { Box, Typography, Divider, Button, LinearProgress } from '@mui/material';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden/index';
import GalleryService from '../../Api/Services/files/galleryService';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { useFormik } from 'formik';
import styles from './styles';
import { useSelector } from 'react-redux';


function RenameFilesFolder(props) {
  const { selectedEntity, selectedUser, handleClose, tostAlert, isFolder, parentRootId, fetchFilesAndFolders, existingFilesName } = props;
  const classes = styles;
  const [loading, setLoading] = useState(false);

  const selected_space = useSelector(state => state.current_selected_data.selected_space)
  const selected_project = useSelector(state => state.current_selected_data.selected_project)


  const apiErrorHandler = (err) => {
    if (err.response !== undefined && err.response !== null) {
      if (err.response.data === null)
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error');
      else if ("schema_errors" in err.response.data)
        props.tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error');
      else if ("message" in err.response.data)
        props.tostAlert(err.response.data.message, 'error');
      else
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error');
    }
    else {
      if (err.message === "Network Error")
        props.tostAlert(<FormattedMessage {...messages.serverError} />, 'error');
    }
  };

  const validate = values => {
    const errors = {};
    if (values.entityName === null || values.entityName === undefined || values.entityName === "")
      errors.entityName = isFolder ? <FormattedMessage {...messages.folderNameReqd} /> : <FormattedMessage {...messages.fileNameReqd} />;
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      entityName: selectedEntity?.entityName ?? '',
    },
    validate,
    onSubmit: async values => {
      if (existingFilesName.includes(values.entityName)) {
        tostAlert(<FormattedMessage {...messages.sameNameExist} />, "error");
        return false;
      }
      setLoading(true);
      const accID = props.selectedUser.root_account_id
      const subscriberId = props.selectedUser.subscriber_id
      const subscriptionId = props.selectedUser.subscription_id
      const schemaId = selected_project.payload.__auto_id__

      const resObj = isFolder ?
        ({
          folder_name: values.entityName,
          access_type: selectedEntity.access_type,
          can_be_subscribed: selectedEntity.can_be_subscribed,
          parent_folder_id: parentRootId
        })
        :
        ({
          access_type: selectedEntity.access_type,
          file_attributes: { ...selectedEntity.entityMetaData, file_name: values.entityName },
          file_type: selectedEntity.entitySubType
        });

      const fnc = isFolder ?
        GalleryService.modifyFolder(accID, subscriberId, subscriptionId, schemaId, selectedEntity.entityId, resObj)
        :
        GalleryService.modifyFiles(accID, subscriberId, subscriptionId, schemaId, selectedEntity.entityId, resObj);

      fnc
        .then(res => {
          tostAlert(<FormattedMessage {...messages.renameSuccessfull} />, "success");
          fetchFilesAndFolders(parentRootId);
          handleClose();
        })
        .catch(err => {
          console.log(err);
          apiErrorHandler(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  });

  return (
    <Box sx={{ ...classes.modal, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
      <form onSubmit={formik.handleSubmit}>
        <Box px={2.5} py={1.875} display="flex" justifyContent="space-between">
          <Box>
            <Typography sx={classes.addObjectiveHeading}>
              {isFolder ? <FormattedMessage {...messages.headingFolder} /> : <FormattedMessage {...messages.headingFile} />}
            </Typography>
          </Box>
          <Box>
            <Button
              size="small"
              disableElevation
              variant="contained"
              sx={classes.cancelBtn}
              onClick={props.handleClose}
            >
              <FormattedMessage {...messages.cancelBtn} />
            </Button>
            <Button
              type="submit"
              disableElevation
              size="small"
              variant="contained"
              color="secondary"
              sx={classes.saveBtn}
            >
              <FormattedMessage {...messages.saveBtn} />
            </Button>
          </Box>
        </Box>
        <Divider />
        {loading && <LinearProgress />}
        <Box px={2.5} py={1.875}>
          <TextField
            error={formik.errors.entityName && formik.touched.entityName}
            helperText={(formik.touched.entityName) ? formik.errors.entityName : ""}
            name="entityName"
            label={isFolder ? <FormattedMessage {...messages.folderName} /> : <FormattedMessage {...messages.fileName} />}
            variant="filled"
            fullWidth
            margin="normal"
            size="small"
            onChange={formik.handleChange}
            value={formik.values.entityName}
          />
        </Box>
      </form>
    </Box>
  );
}

RenameFilesFolder.propTypes = {};

export default RenameFilesFolder;