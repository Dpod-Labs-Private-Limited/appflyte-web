import React, { useState } from 'react';
import { Box, Typography, Divider, Button, LinearProgress } from '@mui/material'; // MUI v5 imports
import { TextFieldOverridden as TextField } from '../TextFieldOverridden/index';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { useFormik } from 'formik';
import { useSelector } from 'react-redux';
import GalleryService from '../../Api/Services/files/galleryService';
import { useAppContext } from '../../context/AppContext';

function AddNewFolder(props) {
  const { parentRootId, selectedUser, handleClose, tostAlert, fetchFilesAndFolders, existingFilesName } = props;

  const [loading, setLoading] = useState(false);
  const { selectedProject } = useAppContext();


  const apiErrorHandler = (err) => {
    if (err.response !== undefined && err.response !== null) {
      if (err.response.data === null)
        tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error');
      else if ("schema_errors" in err.response.data)
        tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error');
      else if ("message" in err.response.data)
        tostAlert(err.response.data.message, 'error');
      else
        tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error');
    } else {
      if (err.message === "Network Error")
        tostAlert(<FormattedMessage {...messages.serverError} />, 'error');
    }
  };

  const validate = (values) => {
    const errors = {};
    if (!values.folderName) {
      errors.folderName = <FormattedMessage {...messages.folderNameReqd} />;
    }
    return errors;
  };

  const formik = useFormik({
    initialValues: {
      folderName: '',
    },
    validate,
    onSubmit: async (values) => {
      if (existingFilesName.includes(values.folderName)) {
        tostAlert(<FormattedMessage {...messages.sameNameExist} />, "error");
        return false;
      }
      setLoading(true);
      const { root_account_id, subscriber_id, subscription_id } = selectedUser;
      const schemaId = selectedProject.payload.__auto_id__
      const resObj = {
        folder_name: values.folderName,
        can_be_subscribed: true,
        access_type: "PRIVATE",
        parent_folder_id: parentRootId,
      };
      try {
        await GalleryService.createFolder(root_account_id, subscriber_id, subscription_id, schemaId, resObj);
        tostAlert(<FormattedMessage {...messages.folderCreated} />, "success");
        fetchFilesAndFolders(parentRootId);
        handleClose();
      } catch (err) {
        console.error(err);
        apiErrorHandler(err);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <Box
      sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 3,
        borderRadius: 2,
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Typography variant="h6">
            <FormattedMessage {...messages.heading} />
          </Typography>
          <Box>
            <Button
              size="small"
              disableElevation
              variant="contained"
              color="default"
              onClick={handleClose}
            >
              <FormattedMessage {...messages.cancelBtn} />
            </Button>
            <Button
              type="submit"
              size="small"
              disableElevation
              variant="contained"
              color="secondary"
              sx={{ ml: 2 }}
            >
              <FormattedMessage {...messages.saveBtn} />
            </Button>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {loading && <LinearProgress sx={{ width: '100%' }} />}
        <Box>
          <TextField
            error={formik.errors.folderName && formik.touched.folderName}
            helperText={formik.touched.folderName ? formik.errors.folderName : ""}
            name="folderName"
            label={<FormattedMessage {...messages.folderName} />}
            variant="filled"
            fullWidth
            margin="normal"
            size="small"
            onChange={formik.handleChange}
            value={formik.values.folderName}
          />
        </Box>
      </form>
    </Box>
  );
}

AddNewFolder.propTypes = {};

export default AddNewFolder;
