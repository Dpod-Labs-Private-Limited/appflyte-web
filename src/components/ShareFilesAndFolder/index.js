/**
 *
 * ShareFilesAndFolder
 *
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, RadioGroup, FormControlLabel, Radio, Chip, LinearProgress, Autocomplete } from '@mui/material';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden/index';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import GalleryService from '../../Api/Services/files/galleryService';
import { ENTITY_TYPE_DIRECTORY } from '../../utils/constants';
import moment from 'moment';
import { useSelector } from 'react-redux';


function ShareFilesAndFolder(props) {

  const { selectedUser, handleClose, selectedEntity, tostAlert } = props;

  const [value, setValue] = useState('selectedPeople');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [allStaffsUserIds, setAllStaffUserIds] = useState([]);
  const [loading, setLoading] = useState(false);

  const selected_space = useSelector(state => state.current_selected_data.selected_space)
  const selected_project = useSelector(state => state.current_selected_data.selected_project)


  useEffect(() => {
    if (props.staffList) {
      const tempArr = [];
      const tempArrId = [];
      props.staffList.professional.forEach(staff => {
        tempArr.push({
          user_id: staff.staffDetails.userId,
          mobile_number: staff.staffDetails.mobileNumber,
          first_name: staff.staffDetails.firstName,
          email: staff.staffDetails.email
        });
        tempArrId.push(staff.staffDetails.userId);
      });
      props.staffList.non_professional.forEach(staff => {
        tempArr.push({
          user_id: staff.staffDetails.userId,
          mobile_number: staff.staffDetails.mobileNumber,
          first_name: staff.staffDetails.firstName,
          email: staff.staffDetails.email
        });
        tempArrId.push(staff.staffDetails.userId);
      });
      setUsersList(tempArr);
      setAllStaffUserIds(tempArrId);
    }
  }, [props.staffList]);

  useEffect(() => {
    if (selectedEntity && selectedEntity.length > 0) {
      getAccessListForEntity(selectedEntity[0].entityId);
    }
  }, [selectedEntity]);

  const getAccessListForEntity = (entityId) => {
    setLoading(true);
    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const schemaId = selected_project.payload.__auto_id__

    GalleryService.getSharedUsersListForEntity(accID, subscriberId, subscriptionId, schemaId, entityId)
      .then(res => {
        const tempSelectedUsers = res.data.map(item => ({
          user_id: item.user_id,
          mobile_number: item.mobile_number,
          first_name: item.first_name,
          email: item.email
        }));
        setSelectedUsers(tempSelectedUsers);
      })
      .catch(err => {
        console.log("Error while fetching Shared User List");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleAutoSuggest = (event, value) => {
    if (value !== null) {
      let arr = [...selectedUsers];
      arr.push(value);
      setSelectedUsers(arr);
    }
  };

  const handleUserDelete = (index) => {
    let tempArr = [...selectedUsers];
    tempArr.splice(index, 1);
    setSelectedUsers(tempArr);
  };

  const copyLink = () => {
    const baseUrl = process.env.COACH_WEB_APP_URL;
    let finalUrl = baseUrl;
    if (selectedEntity.length === 1 && selectedEntity[0].entityType === ENTITY_TYPE_DIRECTORY)
      finalUrl += 'files/shared-with-me/' + selectedEntity[0].entityId;
    else
      finalUrl += 'files/shared-with-me';

    const el = document.createElement('textarea');
    el.value = finalUrl;
    el.setAttribute('readonly', ''); // Make it readonly to be tamper-proof
    el.style.position = 'absolute';
    el.style.left = '-9999px'; // Move outside the screen to make it invisible
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);

    tostAlert(<FormattedMessage {...messages.copied} />, "success");
  };

  const handleSubmit = async () => {
    setLoading(true);
    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const schemaId = selected_project.payload.__auto_id__

    let folderShareArr = [];
    let fileShareArr = [];
    const userIdList = value === 'allStaffs' ? allStaffsUserIds : selectedUsers.map(item => item.user_id);

    selectedEntity.forEach(entity => {
      if (entity.entityType === ENTITY_TYPE_DIRECTORY)
        folderShareArr.push(entity.entityId);
      else
        fileShareArr.push(entity.entityId);
    });

    const folderShareResObj = {
      user_id_list: userIdList,
      expiry_date: moment().add(1, 'months').format("YYYY-MM-DD"),
      folder_id_list: folderShareArr,
      permissions: {
        can_share: true,
        is_owner: true,
        can_edit: true,
        can_publish: true
      }
    };

    const fileShareResObj = {
      user_id_list: userIdList,
      expiry_date: moment().add(1, 'months').format("YYYY-MM-DD"),
      file_id_list: fileShareArr,
      permissions: {
        can_share: true,
        is_owner: true,
        can_edit: true,
        can_publish: true
      }
    };

    let folderShareFlag = false;

    try {
      const resFolder = await GalleryService.shareFolders(accID, subscriberId, subscriptionId, schemaId, folderShareResObj);
      folderShareFlag = true;
    }
    catch (errFolder) {
      console.log("Error occurred while moving Folders", errFolder);
      folderShareFlag = false;
    }

    try {
      const resFile = await GalleryService.shareFiles(accID, subscriberId, subscriptionId, schemaId, fileShareResObj);
      if (folderShareFlag)
        tostAlert(<FormattedMessage {...messages.bothShared} />, "success");
      else
        tostAlert(<FormattedMessage {...messages.partialSharedFiles} />, "warning");

      handleClose();
    }
    catch (errFile) {
      console.log("Error occurred while moving Files", errFile);
      if (folderShareFlag)
        tostAlert(<FormattedMessage {...messages.partialSharedFiles} />, "success");
      else
        tostAlert(<FormattedMessage {...messages.someErrOccrd} />, "warning");
    }
    finally {
      setLoading(false);
    }
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
        <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>
          <FormattedMessage {...messages.heading} />
        </Typography>
        <Box>
          <Button
            size="small"
            color="secondary"
            disableElevation
            variant="outlined"
            sx={{ marginRight: 2 }}
            onClick={copyLink}
          >
            <FormattedMessage {...messages.copyLink} />
          </Button>
          <Button
            size="small"
            disableElevation
            variant="contained"
            sx={{ marginRight: 2 }}
            onClick={handleClose}
          >
            <FormattedMessage {...messages.cancelBtn} />
          </Button>
          <Button
            size="small"
            disableElevation
            variant="contained"
            color="secondary"
            onClick={handleSubmit}
          >
            <FormattedMessage {...messages.saveBtn} />
          </Button>
        </Box>
      </Box>

      {loading && <LinearProgress sx={{ width: '100%' }} />}

      <Box display="flex" width="100%" justifyContent="flex-start" px="20px" py="10px">
        <RadioGroup aria-label="accessType" size="small" name="accessType" row value={value} onChange={handleChange}>
          <FormControlLabel
            sx={{ label: { fontSize: '14px', color: 'gray' } }}
            value="allStaffs"
            control={<Radio size='small' />}
            label={<FormattedMessage {...messages.allStaffs} />}
          />
          <FormControlLabel
            sx={{ label: { fontSize: '14px', color: 'gray' } }}
            value="selectedPeople"
            control={<Radio size='small' />}
            label={<FormattedMessage {...messages.selectedPeople} />}
          />
        </RadioGroup>
      </Box>

      {value === "selectedPeople" && (
        <Box px="20px" py="15px">
          <Autocomplete
            id="usersList"
            options={usersList}
            name="usersList"
            size="small"
            getOptionLabel={(option) => option.first_name}
            renderInput={(params) => <TextField {...params} size="small" margin="normal" label="Search and Add" variant="filled" />}
            onChange={handleAutoSuggest}
          />
          <Box my="15px" display="flex" width="100%" flexWrap="wrap">
            {selectedUsers.map((item, index) => (
              <Box p="5px" key={"tag_key_" + index}>
                <Chip
                  label={item.first_name}
                  color="secondary"
                  onDelete={() => handleUserDelete(index)}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

ShareFilesAndFolder.propTypes = {};

export default ShareFilesAndFolder;
