/**
 *
 * MoveToFolder
 *
 */

import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Divider, LinearProgress } from '@mui/material';
import { FolderOutlined, DescriptionOutlined, ArrowBackIos, InsertPhotoOutlined, MovieCreationOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import GalleryService from '../../Api/Services/files/galleryService';
import { validate } from 'uuid';
import { FILE_TYPE_DOCUMENT, FILE_TYPE_FOLDER, FILE_TYPE_IMAGE, FILE_TYPE_VIDEO, ENTITY_TYPE_DIRECTORY, ENTITY_TYPE_FILE } from '../../utils/constants';
import { useSelector } from 'react-redux';

function MoveToFolder(props) {

  const { selectedUser, handleClose, selectedEntity, tostAlert, fetchFilesAndFolders, parentRootId, pathname } = props;

  const [history, setHistory] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [existingFilesName, setExistingFilesName] = useState([]);
  const [loading, SetLoading] = useState(false);

  const selected_space = useSelector(state => state.current_selected_data.selected_space)
  const selected_project = useSelector(state => state.current_selected_data.selected_project)


  useEffect(() => {
    if (pathname) {
      const paths = pathname.split('/');
      const filteredPath = paths.filter(x => validate(x));
      setHistory(filteredPath);
      if (filteredPath.length === 0)
        getContentsOfCurrentDirectory(null);
      else
        getContentsOfCurrentDirectory(filteredPath[filteredPath.length - 1]);
    }
  }, [pathname]);

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
    } else {
      if (err.message === "Network Error")
        props.tostAlert(<FormattedMessage {...messages.serverError} />, 'error');
    }
  }

  const getContentsOfCurrentDirectory = (parentId) => {
    if (selectedUser) {
      setFileList([]);
      SetLoading(true);
      const accID = props.selectedUser.root_account_id
      const subscriberId = props.selectedUser.subscriber_id
      const subscriptionId = props.selectedUser.subscription_id
      const schemaId = selected_project.payload.__auto_id__

      GalleryService
        .getFolderContents(accID, subscriberId, subscriptionId, schemaId, parentId, null)
        .then(res => {
          const existNames = [];
          const entityFolders = [];
          res.data.folders.forEach(folder => {
            existNames.push(folder.folder_name);
            if (folder.is_hidden) return;
            entityFolders.push({
              entityId: folder.id,
              entityType: ENTITY_TYPE_DIRECTORY,
              entityName: folder.folder_name,
              entityRootId: folder.parent_folder_id,
              entitySubType: FILE_TYPE_FOLDER,
              entityThumbnail: null,
            });
          });
          const entityFiles = [];
          res.data.files.forEach(file => {
            existNames.push(file.file_attributes.file_name);
            if (file.is_hidden) return;
            entityFiles.push({
              entityId: file.id,
              entityType: ENTITY_TYPE_FILE,
              entityName: file.file_attributes.file_name ?? 'Untitled',
              entityRootId: file.folder_id,
              entitySubType: file.file_type,
              entityThumbnail: file.thumbnail_url,
            });
          });
          setExistingFilesName(existNames);
          setFileList([...entityFolders, ...entityFiles]);
        })
        .catch(err => {
          console.log(err);
          apiErrorHandler(err);
        })
        .finally(() => {
          SetLoading(false);
        });
    }
  };

  const handleFolderClick = (folder) => {
    if (folder.entityType === ENTITY_TYPE_FILE) return false;
    const historyTemp = [...history];
    historyTemp.push(folder.entityId);
    setHistory(historyTemp);
    getContentsOfCurrentDirectory(folder.entityId);
  };

  const handleFolderBack = () => {
    const historyTemp = [...history];
    historyTemp.pop();
    setHistory(historyTemp);
    getContentsOfCurrentDirectory(historyTemp[historyTemp.length - 1]);
  };

  const moveFilesAndFolder = async () => {
    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const schemaId = selected_project.payload.__auto_id__

    const folderMoveArr = [];
    const fileMoveArr = [];
    let noOfExistingFiles = 0;
    selectedEntity.forEach(entity => {
      if (existingFilesName.includes(entity.entityName))
        noOfExistingFiles += 1;
      if (entity.entityType == ENTITY_TYPE_DIRECTORY)
        folderMoveArr.push({
          target_parent_folder_id: history.length === 0 ? null : history[history.length - 1],
          folder_id: entity.entityId
        });
      else
        fileMoveArr.push({
          target_folder_id: history.length === 0 ? null : history[history.length - 1],
          file_id: entity.entityId
        });
    });
    if (noOfExistingFiles > 0) {
      tostAlert("Files with same name already exists in the selected folder for " + noOfExistingFiles + " files", "error");
      return false;
    }
    let folderMoveFlag = false;
    try {
      const resFolder = await GalleryService.moveFolder(accID, subscriberId, subscriptionId, schemaId, folderMoveArr);
      folderMoveFlag = true;
    }
    catch (errFolder) {
      console.log("error Occured while moving Folders", errFolder);
      folderMoveFlag = false;
    }
    try {
      const resFile = await GalleryService.moveFiles(accID, subscriberId, subscriptionId, schemaId, fileMoveArr);
      if (folderMoveFlag)
        tostAlert(<FormattedMessage {...messages.bothMoved} />, "success");
      else
        tostAlert(<FormattedMessage {...messages.partialMovedFiles} />, "warning");
      fetchFilesAndFolders(parentRootId);
      setHistory([]);
      handleClose();
    }
    catch (errFile) {
      console.log("error Occured while moving Files", errFile);
      if (folderMoveFlag)
        tostAlert(<FormattedMessage {...messages.partialMovedFolder} />, "success");
      else
        tostAlert(<FormattedMessage {...messages.someErrOccrd} />, "warning");
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
      <Box px={2} py={1.5} display="flex" justifyContent="space-between">
        <Typography variant="h6">
          <FormattedMessage {...messages.heading} />
        </Typography>
        <Box>
          <Button size="small" variant="contained" onClick={handleClose} sx={{ mr: 1 }}>
            <FormattedMessage {...messages.cancelBtn} />
          </Button>
          <Button size="small" variant="contained" color="secondary" onClick={moveFilesAndFolder}>
            <FormattedMessage {...messages.saveBtn} />
          </Button>
        </Box>
      </Box>
      <Divider />
      {loading && <LinearProgress />}
      <Box px={1} py={2}>
        {loading === false && history.length > 0 && (
          <Box px={2} sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleFolderBack}>
            <ArrowBackIos sx={{ mr: 2 }} />
            <Typography variant="body2"><FormattedMessage {...messages.back} /></Typography>
          </Box>
        )}
        {fileList.map(folder => (
          <Box
            key={folder.entityId}
            px={2}
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              py: 1,
              ...(folder.entitySubType === FILE_TYPE_FOLDER ? { borderBottom: '1px solid #ddd' } : {}),
            }}
            onDoubleClick={() => handleFolderClick(folder)}
          >
            <Box mr={2}>
              {folder.entitySubType === FILE_TYPE_FOLDER && <FolderOutlined />}
              {folder.entitySubType === FILE_TYPE_DOCUMENT && <DescriptionOutlined />}
              {folder.entitySubType === FILE_TYPE_IMAGE && <InsertPhotoOutlined />}
              {folder.entitySubType === FILE_TYPE_VIDEO && <MovieCreationOutlined />}
            </Box>
            <Typography variant="body2">{folder.entityName}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

MoveToFolder.propTypes = {};

export default MoveToFolder;
