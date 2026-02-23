/**
 *
 * FileUpload
 *
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, CircularProgress, Divider, Radio, FormControlLabel, RadioGroup, LinearProgress } from '@mui/material';
import styles from './styles'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { CancelOutlined, CheckCircleOutlineOutlined, QueryBuilderOutlined, ErrorOutlineOutlined } from '@mui/icons-material';
import { DropzoneAreaBase, DropzoneArea } from 'material-ui-dropzone';
import messages from './messages';
import LoadingOverlay from 'react-loading-overlay';
import { FILE_TYPE_IMAGE, FILE_TYPE_VIDEO, FILE_TYPE_DOCUMENT } from '../../../utils/constants';
import { getFileType, getOriginalDimensions, getImageThumbnail, getVideoCover } from '../../../Api/Services/files/fileUtilityService';
import moment from 'moment';
import { validate } from 'uuid';
import GalleryService from '../../../Api/Services/files/galleryService';
import FileUploadServices from '../../../Api/Services/files/fileUploadServices';
import { useAppContext } from '../../../context/AppContext';
import { useOutletContext } from 'react-router-dom';


let uploadProgress = []
let resJsonVar = []

export function FileUpload() {
  const classes = styles;
  const { selectedProject } = useAppContext();
  const { setLoading, staffList, tostAlert, selectedUser, location, navigate } = useOutletContext();

  const [filesUpload, setfilesUpload] = useState([]);
  const [loading, SetLoading] = useState(false)
  const [loadingSave, SetLoadingSave] = useState(false)
  const [uploadProgressState, setUploadProgress] = useState([])
  const [filePermission, setFilePermission] = useState("PUBLIC")
  const [parentRootId, setParentRootId] = useState(null)
  const [existingFilesName, setExistingFilesName] = useState(location.existingFiles ?? [])

  //Temp states
  const [selectedImageDimensions, setSelectedImageDimensions] = useState({
    height: 250,
    width: 250
  })
  const [uploadJson, setUploadJson] = useState([])


  useEffect(() => {
    if (location && selectedUser) {
      const pathParts = location.pathname.split('/')
      let lastPart = pathParts[pathParts.length - 2]
      if (lastPart === "" || !validate(lastPart)) {
        lastPart = null
      }
      setParentRootId(lastPart)

      if (location.existingFiles == null) {
        fetchFileNamesInParent(lastPart)
      }
    }
  }, [location, selectedUser])

  const handlePermissionChange = (event) => {
    setFilePermission(event.target.value);
  };

  const onFilesSelected = (files) => {
    const preSelectedFileNames = filesUpload.map(item => item.file.name)
    const filesToAdd = files.filter(x => !preSelectedFileNames.includes(x.file.name))
    setfilesUpload((prevState) => {
      return [...prevState, ...filesToAdd]
    })
  }

  const onFilesDeselect = (file) => {
    const filesListAfter = filesUpload.filter(x => x.file.name !== file.file.name)
    setfilesUpload(filesListAfter)
  }

  const onFilesError = (error, file) => {
    tostAlert(error.message, "error")
  }

  const apiErrorHandler = (err) => {
    if (err.response !== undefined && err.response !== null) {
      if (err.response.data === null)
        tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
      else if ("schema_errors" in err.response.data)
        tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error')
      else if ("message" in err.response.data)
        tostAlert(err.response.data.message, 'error')
      else
        tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
    }
    else {
      if (err.message === "Network Error")
        tostAlert(<FormattedMessage {...messages.serverError} />, 'error')
    }
  }

  const fetchFileNamesInParent = (parentId) => {
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const schemaId = selectedProject.payload.__auto_id__

    GalleryService
      .getFolderContents(accID, subscriberId, subscriptionId, schemaId, parentId, null)
      .then(res => {
        const folderNames = res.data.folders.map(folder => folder.folder_name)
        const fileNames = res.data.files.map(file => file.file_attributes.file_name)
        setExistingFilesName([...fileNames, ...folderNames])
      })
      .catch(err => {
        console.log(err)
        apiErrorHandler(err)
      })
  }

  const markIndexFailed = (index) => {
    const tempLoadArr = [...uploadProgress]
    tempLoadArr[index] = 'failed'
    uploadProgress = tempLoadArr
    setUploadProgress([...tempLoadArr])
  }

  const uploadFile = async (blob, reqBody) => {
    try {

      const accID = selectedUser.root_account_id
      const subscriberId = selectedUser.subscriber_id
      const subscriptionId = selectedUser.subscription_id
      const schemaId = selectedProject.payload.__auto_id__

      const resData = await FileUploadServices.getPredignedURL(accID, subscriberId, subscriptionId, schemaId, JSON.stringify(reqBody))
      if (resData.status === 200) {
        if (resData.data.provider === 'azure') {
          const resUpload = await FileUploadServices.azureUploadFile(resData.data.url, blob)
          if (resUpload.status === 200 || resUpload.status === 204 || resUpload.status === 201)
            return resData.data.file_id
        }
        else {
          const urlFields = JSON.parse(resData.data.url_fields)
          let formData = new FormData();

          formData.append('key', urlFields.key);
          formData.append('AWSAccessKeyId', urlFields.AWSAccessKeyId);
          formData.append('policy', urlFields.policy);
          formData.append('signature', urlFields.signature);
          formData.append('file', blob);

          const resUpload = await FileUploadServices.uploadFile(resData.data.url, formData)
          if (resUpload.status === 200 || resUpload.status === 204)
            return resData.data.file_id
        }
      }
      return null
    } catch (e) {
      console.log('Err ' + e)
      return null
    }
  }

  const uploadAndAppendForPost = async (file, fileType, thumbnailFileId, index) => {
    const reqBodyFile = {
      file_context: 'bucket_dpod_user_file',
      content_type: file.name.split('.')[1],
      file_type: '',
      file_name: file.name
    }

    const uploadedFileId = await uploadFile(file, reqBodyFile)
    const tempJsonArr = [...resJsonVar]

    const uploadResObj = {
      access_type: filePermission,
      file_type: fileType,
      folder_id: parentRootId ? parentRootId : 'ROOT',
      file_id: uploadedFileId,
      thumbnail_file_id: thumbnailFileId,
      file_attributes: {
        file_name: file.name,
        created_on: moment().format("DD-MM-YYYY"),
        file_extension: file.name.split('.')[1]
      }
    }

    tempJsonArr.push(uploadResObj)
    resJsonVar = tempJsonArr
    setUploadJson(tempJsonArr)
    const tempLoadArr = [...uploadProgress]
    tempLoadArr[index] = 'processed'
    uploadProgress = tempLoadArr
    setUploadProgress([...tempLoadArr])

  }

  const uploadThumbnailAndImage = async (fileType, file, index, blob) => {
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const thumbnailName = file.name.split('.')[0] + "-thumbnail-" + fileType + "-" + accID + ".jpg"
    const reqBodyThumbnail = {
      file_context: 'thumbnail_images',
      content_type: "jpg",
      file_type: '',
      file_name: thumbnailName
    }
    const thumbnailFileId = await uploadFile(blob, reqBodyThumbnail)
    await uploadAndAppendForPost(file, fileType, thumbnailFileId, index)
  }

  const uploadSvgThumbnail = async (fileType, file, index, blob) => {
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const thumbnailName = file.name.split('.')[0] + "-thumbnail-" + fileType + "-" + accID + ".svg"
    const reqBodyThumbnail = {
      file_context: 'thumbnail_images',
      content_type: "svg",
      file_type: '',
      file_name: thumbnailName
    }
    const thumbnailFileId = await uploadFile(blob, reqBodyThumbnail)
    await uploadAndAppendForPost(file, fileType, thumbnailFileId, index)
  }

  const handleImageUpload = (file, index, size) => {
    try {
      const sizeToUse = size ?? selectedImageDimensions
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        getImageThumbnail(reader.result, sizeToUse, uploadThumbnailAndImage.bind(this, FILE_TYPE_IMAGE, file, index))
      });
      reader.readAsDataURL(file);
    }
    catch (err) {
      console.log("ERROR: ", err);
      markIndexFailed(index)
    }
  }

  const handleDocumentUpload = async (file, index) => {
    try {
      await uploadAndAppendForPost(file, FILE_TYPE_DOCUMENT, null, index)
    }
    catch (err) {
      console.log("ERROR: ", err);
      markIndexFailed(index)
    }
  }

  const handleVideoUpload = async (file, index) => {
    try {
      // get the frame at 1.5 seconds of the video file
      const cover = await getVideoCover(file, 1.5);
      uploadThumbnailAndImage(FILE_TYPE_VIDEO, file, index, cover)
    }
    catch (err) {
      console.log("ERROR: ", err);
      markIndexFailed(index)
    }
  }

  const handleSvgUpload = async (file, index) => {
    try {
      uploadSvgThumbnail(FILE_TYPE_IMAGE, file, index, file)
    }
    catch (err) {
      console.log("ERROR: ", err);
      markIndexFailed(index)
    }
  }

  const uploadSingleFile = (file, index) => {

    const tempLoadArr = [...uploadProgress]
    tempLoadArr[index] = 'uploading'
    uploadProgress = tempLoadArr
    setUploadProgress([...tempLoadArr])

    const fileExt = file.name.split('.')[1].toLowerCase()
    const fileType = getFileType(file)

    switch (fileType) {
      case FILE_TYPE_IMAGE:
        if (fileExt === "svg")
          handleSvgUpload(file, index)
        else
          getOriginalDimensions(file, handleImageUpload.bind(this, file, index))
        break
      case FILE_TYPE_VIDEO:
        handleVideoUpload(file, index)
        break
      case FILE_TYPE_DOCUMENT:
        handleDocumentUpload(file, index)
        break
      default:
        handleDocumentUpload(file, index)
    }
  }

  const createFile = (bits, name) => {
    try {
      // If this call fails, we go for Blob ( in Older Browser File constructor does not work )
      return new File(bits, name);
    } catch (e) {
      console.log("In the catch block of createFile", e)
      // If we reach this point a new File could not be constructed
      var myBlob = new Blob(bits);
      myBlob.lastModified = new Date();
      myBlob.name = name;
      return myBlob;
    }
  };

  const checkExistingFileName = (file, level) => {
    if (existingFilesName.includes(file.name)) {
      const newNameArr = file.name.split(".")
      if (level > 1) {
        const lastIndex = newNameArr[0].lastIndexOf("(" + (level - 1) + ")")
        console.log(lastIndex)
        newNameArr[0] = lastIndex > -1 ? newNameArr[0].substring(0, lastIndex) : newNameArr[0]
      }
      newNameArr[0] = newNameArr[0] + "(" + level + ")"
      const newName = newNameArr.join(".")
      const newFile = createFile([file], newName)
      return checkExistingFileName(newFile, ++level)
    }
    return file
  }

  const startUploading = () => {
    if (filesUpload.length === 0) {
      tostAlert(<FormattedMessage {...messages.selectAtleast1File} />, "error")
      return false
    }
    SetLoading(true)
    const tempArr = filesUpload.map(file => 'pending')
    setUploadProgress([...tempArr])
    uploadProgress = tempArr
    filesUpload.forEach((file, index) => {
      const nameCheckedFile = checkExistingFileName(file.file, 1)
      uploadSingleFile(nameCheckedFile, index)
    })
  }

  const closeUploadIndicator = () => {
    SetLoading(false)
    setUploadProgress([])
    uploadProgress = []
    resJsonVar = []
    uploadProgress = []
    navigate(-1)
  }

  const saveUploadChanges = () => {
    SetLoadingSave(true)
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const schemaId = selectedProject.payload.__auto_id__

    GalleryService
      .createFile(accID, subscriberId, subscriptionId, schemaId, uploadJson)
      .then(res => {
        if (uploadProgressState.length > 1)
          tostAlert(uploadProgressState.length + " files uploaded", "success")
        else
          tostAlert("File uploaded", "success")
      })
      .catch(err => {
        console.log(err)
        apiErrorHandler(err)
      })
      .finally(() => {
        SetLoadingSave(false)
        uploadProgress = []
        resJsonVar = []
        navigate(-1);
      })
  }

  useEffect(() => {
    if (uploadProgressState && uploadProgressState.length && uploadProgressState.length > 0) {
      let i
      let flagToSave = true
      for (i = 0; i < uploadProgressState.length; i++) {
        if (!(uploadProgressState[i] === "processed" || uploadProgressState[i] === "done" || uploadProgressState[i] === "failed")) {
          flagToSave = false
          break
        }
      }
      if (flagToSave) {
        saveUploadChanges()
      }
    }
  }, [uploadProgressState])


  return (
    <Box sx={classes.mainContainer}>
      <Box sx={classes.cardContainer}>

        <Box sx={classes.breadButtonsBox}>
          <Button
            disableElevation
            variant='contained'
            size="small"
            sx={classes.uploadBtn}
            onClick={closeUploadIndicator}
          >
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button
            disableElevation
            variant='contained'
            size="small"
            color="secondary"
            sx={classes.newFolderBtn}
            onClick={startUploading}
          >
            <FormattedMessage {...messages.upload} />
          </Button>
        </Box>

        {
          uploadProgressState && uploadProgressState.length > 0
            ?
            <Box sx={classes.uploadLoadingBox}>
              <Box sx={classes.uploadingHeaderBox}>
                {
                  loadingSave
                    ?
                    <Typography sx={classes.uploadingText}><FormattedMessage {...messages.savingChanges} /></Typography>
                    :
                    <Typography sx={classes.uploadingText}><FormattedMessage {...messages.uploadingFile} /></Typography>
                }
                {
                  !loadingSave ? <CancelOutlined sx={classes.closeIcon} onClick={closeUploadIndicator} /> : ''
                }
              </Box>
              {
                loadingSave ? <LinearProgress width="100%" /> : ''
              }
              <Box width="100%">
                {
                  filesUpload.map((file, index) =>
                    <Box>
                      {
                        index > 0 ? <Divider width="100%" /> : ''
                      }
                      <Box display="flex" height="40px" width="100%" alignItems="center" paddingX="10px">
                        {
                          ({
                            'uploading': <CircularProgress size="18px" sx={classes.tickIcon} color="primary" />,
                            'processed': <CheckCircleOutlineOutlined sx={classes.tickIcon} color="primary" />,
                            'pending': <QueryBuilderOutlined sx={classes.tickIcon} color="primary" />,
                            'done': <CheckCircleOutlineOutlined sx={classes.tickIcon} color="primary" />,
                            'failed': <ErrorOutlineOutlined sx={classes.failedIcon} />
                          }[uploadProgressState[index]])
                        }
                        <Typography noWrap sx={classes.dropZoneFont}>{file.file.name}</Typography>
                      </Box>
                    </Box>
                  )
                }
              </Box>
            </Box>
            :
            ''
        }

        <Box display="flex" pt={5} justifyContent="center">
          <Box width="85%" maxWidth="960px">
            <LoadingOverlay
              active={loading}
              horizontal
              styles={{
                wrapper: {
                  height: '100%',
                  width: '100%',
                },
                overlay: (base) => ({
                  ...base,
                  background: 'rgba(0, 0, 0, 0.2)',
                  zIndex: 1600,
                  height: '100%',
                  position: 'fixed'
                }),
              }}>
              <Box>
                <Paper sx={classes.paper} elevation={0}>
                  <Box display="flex" flexDirection="column" p={3}>
                    <Typography sx={classes.addObjectiveHeading}>
                      <FormattedMessage {...messages.uploadFiles} />
                    </Typography>
                    <Box marginTop="25px" marginBottom="10px">
                      <DropzoneAreaBase
                        acceptedFiles={['video/*', 'image/*', '.pdf', '.doc']}
                        onAdd={onFilesSelected}
                        onDelete={onFilesDeselect}
                        onError={onFilesError}
                        maxFileSize={500000000}
                        dropzoneText="DRAG AND DROP A FILE OR CLICK TO UPLOAD"
                        showAlerts={false}
                        filesLimit={10}
                        fileObjects={filesUpload}
                        dropzoneClass={classes.dropZone}
                        dropzoneParagraphClass={classes.dropZoneFont}
                        showPreviews={true}
                        showPreviewsInDropzone={false}
                        useChipsForPreview
                        previewGridProps={{ container: { spacing: 1, direction: 'row', } }}
                        previewChipProps={{ classes: { root: classes.previewChip }, color: "secondary", variant: "filled" }}
                        previewText=""
                      />
                    </Box>
                    {/* <Typography sx={classes.boldText}><FormattedMessage {...messages.manageAccess} /></Typography>
                    <RadioGroup aria-label="gender" name="gender1" row value={filePermission} onChange={handlePermissionChange}>
                      <FormControlLabel classes={{ label: classes.mediumLabel }} value="PRIVATE" control={<Radio size='small' />} label={<FormattedMessage {...messages.private} />} />
                      <FormControlLabel classes={{ label: classes.mediumLabel }} value="PUBLIC" control={<Radio size='small' />} label={<FormattedMessage {...messages.public} />} />
                      <FormControlLabel classes={{ label: classes.mediumLabel }} value="SUBSCRIPTION_REQUIRED" control={<Radio size='small' />} label={<FormattedMessage {...messages.reqSubscription} />} />
                    </RadioGroup> */}
                  </Box>
                </Paper>
              </Box>
            </LoadingOverlay>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}

FileUpload.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(withConnect)(FileUpload);
