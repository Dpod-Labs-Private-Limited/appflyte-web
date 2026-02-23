/**
 *
 * FilesRecycleBin
 *
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, InputAdornment, Tooltip, Avatar, Menu, MenuItem, Checkbox, Divider, LinearProgress } from '@mui/material';
import { TextFieldOverriddenWhite as TextField } from '../../../components/TextFieldOverridden/index';
import styles from './styles'
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { FilterAlt } from '../../../icons/extraIcons';
import { Search, MoreHoriz, DeleteForeverOutlined, RestoreFromTrashOutlined, ArrowBackIos } from '@mui/icons-material';
import FileItem from '../../../components/FileItem';
import messages from './messages';
import { validate } from 'uuid';
import { FILE_TYPE_DOCUMENT, FILE_TYPE_FOLDER, FILE_TYPE_IMAGE, FILE_TYPE_VIDEO, ENTITY_TYPE_DIRECTORY, ENTITY_TYPE_FILE } from '../../../utils/constants';
import { useSelector } from 'react-redux';
import GalleryService from '../../../Api/Services/files/galleryService';
import { useAppContext } from '../../../context/AppContext';
import { useOutletContext } from 'react-router-dom';

export function FilesRecycleBin() {

  const classes = styles;
  const { selectedProject } = useAppContext();
  const { setLoading, staffList, tostAlert, selectedUser, location, navigate } = useOutletContext();

  const [loading, SetLoading] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState([])
  const [selectedEntityDetails, setSelectedEntityDetails] = useState([])
  const [appliedFilters, setAppliedFilters] = useState([])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [anchorMoreItems, setAnchorMoreItems] = useState(null);
  const [anchorFilter, setAnchorFilter] = useState(null);

  const [fileList, setFileList] = useState([])
  const [filteredFilesList, setFilteredList] = useState([])
  const [parentRootId, setParentRootId] = useState(null)


  useEffect(() => {
    fetchRecyclebinContent()
  }, [selectedUser])

  useEffect(() => {
    const pathParts = location.pathname.split('/')
    const lastPart = pathParts[pathParts.length - 1]
    setFileList([])
    setFilteredList([])
    if (lastPart != null && lastPart !== "" && validate(lastPart)) {
      setParentRootId(lastPart)
      fetchRecyclebinContent(lastPart)
    }
    else {
      setParentRootId(null)
      fetchRecyclebinContent(null)
    }
  }, [selectedUser, location])

  const fetchRecyclebinContent = (parentId) => {
    if (selectedUser) {
      setSelectedEntity([])
      setSelectedEntityDetails([])
      SetLoading(true)
      const accID = selectedUser.root_account_id
      const subscriberId = selectedUser.subscriber_id
      const subscriptionId = selectedUser.subscription_id
      const schemaId = selectedProject.payload.__auto_id__

      GalleryService
        .getRecycleBinContent(accID, subscriberId, subscriptionId, schemaId, parentId, null)
        .then(res => {
          const entityFolders = res.data.folders.map(folder => ({
            entityId: folder.id,
            entityType: ENTITY_TYPE_DIRECTORY,
            entityName: folder.folder_name,
            entityRootId: folder.parent_folder_id,
            entitySubType: FILE_TYPE_FOLDER,
            entityExtention: null,
            entityThumbnail: null,
            entityMetaData: null,
            subscriptionId: folder.subscription_id,
            subscriberId: folder.subscriber_id,
            access_type: folder.access_type,
            can_be_subscribed: folder.can_be_subscribed,
            bucketName: null,
            objectKey: null
          }))
          const entityFiles = res.data.files.map(file => ({
            entityId: file.id,
            entityType: ENTITY_TYPE_FILE,
            entityName: file.file_attributes.file_name ?? 'Untitled',
            entityRootId: file.folder_id,
            entitySubType: file.file_type,
            entityExtention: file.file_attributes.file_extension,
            entityThumbnail: file.thumbnail_url,
            entityMetaData: file.file_attributes,
            subscriptionId: file.subscription_id,
            subscriberId: file.subscriber_id,
            access_type: file.access_type,
            can_be_subscribed: true,
            bucketName: file.bucket_name,
            objectKey: file.object_key
          }))
          setFileList([...entityFolders, ...entityFiles])
          setFilteredList([...entityFolders, ...entityFiles])
        })
        .catch(err => {
          console.log(err)
          apiErrorHandler(err)
        })
        .finally(() => {
          SetLoading(false)
        })
    }
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

  const filterFiles = (filterApplied, masterList) => {
    if (filterApplied && filterApplied.length > 0) {
      let filteredTmp = []
      if (masterList == null)
        filteredTmp = fileList.filter(x => filterApplied.includes(x.entitySubType))
      else
        filteredTmp = masterList.filter(x => filterApplied.includes(x.entitySubType))
      setFilteredList(filteredTmp)
    }
    else {
      if (masterList == null)
        setFilteredList([...fileList])
      else
        setFilteredList([...masterList])
    }
  }

  const handleMenuClickMore = (event) => {
    setAnchorMoreItems(event.currentTarget);
  };

  const handleMenuClickFilter = (event) => {
    setAnchorFilter(event.currentTarget);
  };

  const handleClearFilter = () => {
    setAppliedFilters([])
    filterFiles([])
    setSearchKeyword('')
  }

  const handleFilterChange = (event) => {
    let tmp = [...appliedFilters]
    const pos = tmp.indexOf(event.target.value)
    if (pos < 0)
      tmp.push(event.target.value)
    else
      tmp.splice(pos, 1)
    setAppliedFilters([...tmp])
    searchFnc(searchKeyword, tmp)
  }

  const handleFolderDoubeClick = (folderId, folderName) => {
    const currentPath = location.pathname
    const currentEntityNames = location.state && location.state.entitynames ? { ...location.state.entitynames } : {}
    currentEntityNames[folderId] = folderName
    if (currentPath.charAt(currentPath.length - 1) === '/')
      navigate({
        pathname: currentPath + folderId,
        state: {
          entitynames: { ...currentEntityNames }
        }
      })
    else
      navigate({
        pathname: currentPath + '/' + folderId,
        state: {
          entitynames: { ...currentEntityNames }
        }
      })
  }

  const handleFolderBack = () => {
    let currentEntityNames = {}
    if (location.state && location.state.entitynames != null) {
      currentEntityNames = location.state.entitynames
      delete currentEntityNames[parentRootId]
      location.state.entitynames = currentEntityNames
    }
    const currPathName = location.pathname
    let tmpArr = currPathName.split('/')
    tmpArr.splice(-1)
    navigate({
      pathname: tmpArr.join('/'),
      state: {
        entitynames: { ...currentEntityNames }
      }
    })
  }

  const handleCloseMoreMenu = () => {
    setAnchorMoreItems(null);
  };

  const handleCloseFilterMenu = () => {
    setAnchorFilter(null);
  };

  const handleClickBlank = () => {
    setSelectedEntity([])
    setSelectedEntityDetails([])
  }

  const searchFnc = (key, filtersApplied) => {
    setSearchKeyword(key)
    const res = fileList.filter(item => {
      if (item.entityName.toUpperCase().match(key.toUpperCase()) !== null)
        return item
    })
    filterFiles(filtersApplied, res)
  }

  const handleFilesRestore = async () => {
    handleCloseMoreMenu()
    if (window.confirm("Are you sure you want to restore selected files")) {
      try {
        SetLoading(true)

        const accID = selectedUser.root_account_id
        const subscriberId = selectedUser.subscriber_id
        const subscriptionId = selectedUser.subscription_id
        const schemaId = selectedProject.payload.__auto_id__

        const folderRestoreArr = []
        const fileRestoreArr = []

        selectedEntityDetails.forEach(entity => {
          if (entity.entityType == ENTITY_TYPE_DIRECTORY)
            folderRestoreArr.push(entity.entityId)
          else
            fileRestoreArr.push(entity.entityId)
        })

        let folderRestoreFlag = true;
        let fileRestoreFlag = true;

        if (folderRestoreArr.length > 0) {
          try {
            await GalleryService.recycleBinRestoreFolder(accID, subscriberId, subscriptionId, schemaId, folderRestoreArr)
          } catch (errFolder) {
            console.log("Error occurred while restoring folders", errFolder);
            folderRestoreFlag = false;
          }
        }

        if (fileRestoreArr.length > 0) {
          try {
            await GalleryService.recycleBinRestoreFiles(accID, subscriberId, subscriptionId, schemaId, fileRestoreArr)
          } catch (errFile) {
            console.log("Error occurred while deleting files", errFile);
            fileRestoreFlag = false;
          }
        }

        fetchRecyclebinContent(parentRootId)

        if (folderRestoreFlag && fileRestoreFlag) {
          tostAlert(<FormattedMessage {...messages.bothRestored} />, "success")
        }
        else if (!folderRestoreFlag && fileRestoreFlag) {
          tostAlert(<FormattedMessage {...messages.partialRestoreFiles} />, "warning");
        }
        else if (folderRestoreFlag && !fileRestoreFlag) {
          tostAlert(<FormattedMessage {...messages.partialRestoreFiles} />, "warning");
        }
        else {
          tostAlert(<FormattedMessage {...messages.serverError} />, "warning");
        }

      } catch (error) {
        console.log(error)
      } finally {
        SetLoading(false)
      }
    }
  }

  const handleSelectedFilesDelete = async () => {
    handleCloseMoreMenu()
    if (window.confirm("Are you sure you want to Delete")) {
      try {
        SetLoading(true)

        const accID = selectedUser.root_account_id
        const subscriberId = selectedUser.subscriber_id
        const subscriptionId = selectedUser.subscription_id
        const schemaId = selectedProject.payload.__auto_id__

        const folderDeleteArr = []
        const fileDeleteArr = []

        selectedEntityDetails.forEach(entity => {
          if (entity.entityType == ENTITY_TYPE_DIRECTORY)
            folderDeleteArr.push(entity.entityId)
          else
            fileDeleteArr.push(entity.entityId)
        })

        let folderDeleteFlag = true;
        let fileDeleteFlag = true;

        if (folderDeleteArr.length > 0) {
          try {
            await GalleryService.recycleBinFolderPermanentDelete(accID, subscriberId, subscriptionId, schemaId, folderDeleteArr)
          } catch (errFolder) {
            console.log("Error occurred while deleting folders", errFolder);
            folderDeleteFlag = false;
          }
        }

        if (fileDeleteArr.length > 0) {
          try {
            await GalleryService.recycleBinFilesPermanentDelete(accID, subscriberId, subscriptionId, schemaId, fileDeleteArr)
          } catch (errFile) {
            console.log("Error occurred while deleting files", errFile);
            fileDeleteFlag = false;
          }
        }

        fetchRecyclebinContent(parentRootId)

        if (folderDeleteFlag && fileDeleteFlag) {
          tostAlert(<FormattedMessage {...messages.bothDeleted} />, "success")
        }
        else if (!folderDeleteFlag && fileDeleteFlag) {
          tostAlert(<FormattedMessage {...messages.partialDeletedFiles} />, "warning")
        }
        else if (folderDeleteFlag && !fileDeleteFlag) {
          tostAlert(<FormattedMessage {...messages.partialDeletedFiles} />, "warning")
        }
        else {
          tostAlert(<FormattedMessage {...messages.serverError} />, "warning");
        }
      } catch (error) {
        console.log(error)
      } finally {
        SetLoading(false)
      }
    }
  }

  return (
    <Box sx={classes.mainContainer}>
      <Box sx={classes.cardContainer}>

        <Box sx={classes.breadButtonsBox}>
          <Button
            disableElevation
            variant='contained'
            size="small"
            color="secondary"
            sx={classes.uploadBtn}
            onClick={() => {
              navigate(-1)
            }}
          >
            <FormattedMessage {...messages.back} />
          </Button>
        </Box>

        <Box display="flex" pt={5} justifyContent="center">
          <Box width="85%" maxWidth="960px">
            <Box flex={1} my="20px">
              <TextField
                placeholder="Search"
                id="searchField_in_RecyclebinPage"
                variant='outlined'
                value={searchKeyword}
                fullWidth
                size="small"
                onChange={(evt) => {
                  searchFnc(evt.target.value, appliedFilters)
                }}
                classes={{ root: classes.searchBar }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Tooltip title="Search" >
                        <Search />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box sx={classes.whiteBox}>
              <Box sx={classes.filterHeadBox}>
                <Box display="flex" alignItems='center'>
                  {
                    appliedFilters.length === 0 || appliedFilters.length === 4
                      ?
                      <Typography sx={classes.filterText}><FormattedMessage {...messages.filterTag} /></Typography>
                      :
                      <Typography sx={classes.filterTextClick} onClick={handleClearFilter}><FormattedMessage {...messages.clearFilter} /></Typography>
                  }
                  <FilterAlt color="secondary" onClick={handleMenuClickFilter} sx={classes.filterIcon} />
                </Box>
                <Menu
                  id="file-filter-menu"
                  keepMounted
                  anchorEl={anchorFilter}
                  open={Boolean(anchorFilter)}
                  onClose={handleCloseFilterMenu}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <Box display="flex" alignItems="center" width="185px">
                    <Checkbox
                      size='small'
                      checked={appliedFilters.includes(FILE_TYPE_IMAGE)}
                      onChange={handleFilterChange}
                      value={FILE_TYPE_IMAGE}
                    />
                    <Typography sx={classes.noItemText}><FormattedMessage {...messages.photos} /></Typography>
                  </Box>
                  <Divider width="100%" />
                  <Box display="flex" alignItems="center" width="185px">
                    <Checkbox
                      size='small'
                      checked={appliedFilters.includes(FILE_TYPE_VIDEO)}
                      onChange={handleFilterChange}
                      value={FILE_TYPE_VIDEO}
                    />
                    <Typography sx={classes.noItemText}><FormattedMessage {...messages.videos} /></Typography>
                  </Box>
                  <Divider width="100%" />
                  <Box display="flex" alignItems="center" width="185px">
                    <Checkbox
                      size='small'
                      checked={appliedFilters.includes(FILE_TYPE_DOCUMENT)}
                      onChange={handleFilterChange}
                      value={FILE_TYPE_DOCUMENT}
                    />
                    <Typography sx={classes.noItemText}><FormattedMessage {...messages.documents} /></Typography>
                  </Box>
                  <Divider width="100%" />
                  <Box display="flex" alignItems="center" width="185px">
                    <Checkbox
                      size='small'
                      checked={appliedFilters.includes(FILE_TYPE_FOLDER)}
                      onChange={handleFilterChange}
                      value={FILE_TYPE_FOLDER}
                    />
                    <Typography sx={classes.noItemText}><FormattedMessage {...messages.folders} /></Typography>
                  </Box>
                </Menu>
                {
                  selectedEntity && selectedEntity.length > 0 && parentRootId == null
                    ?
                    <Box sx={classes.actionsBox} onClick={handleMenuClickMore}>
                      <Typography sx={classes.filterText}><FormattedMessage {...messages.actions} /></Typography>
                      <Avatar sx={classes.moreAvatar}>
                        <MoreHoriz sx={classes.moreIcon} />
                      </Avatar>
                    </Box>
                    :
                    ''
                }
                <Menu
                  id="file-select-menu"
                  keepMounted
                  anchorEl={anchorMoreItems}
                  open={Boolean(anchorMoreItems)}
                  onClose={handleCloseMoreMenu}
                  getContentAnchorEl={null}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "right",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                >
                  <MenuItem onClick={handleFilesRestore}>
                    <Box display="flex" width="185px">
                      <RestoreFromTrashOutlined color="secondary" sx={classes.filterIcon} />
                      <Typography sx={classes.noItemText}><FormattedMessage {...messages.restore} /></Typography>
                    </Box>
                  </MenuItem>
                  <MenuItem onClick={handleSelectedFilesDelete}>
                    <Box display="flex" width="185px">
                      <DeleteForeverOutlined color="secondary" sx={classes.filterIcon} />
                      <Typography sx={classes.noItemText}><FormattedMessage {...messages.deleteForever} /></Typography>
                    </Box>
                  </MenuItem>
                </Menu>
              </Box>
              {
                loading ? <LinearProgress marginY="10px" width="100%" /> : ''
              }
              {
                loading === false && parentRootId != null
                  ?
                  <Box display="flex" width="100%" marginY="10px" marginX="5px" sx={classes.linkBox} onClick={handleFolderBack}>
                    <ArrowBackIos sx={classes.backIcon} />
                    <Typography sx={classes.noItemText}><FormattedMessage {...messages.back} /></Typography>
                  </Box>
                  :
                  ''
              }
              <Box display="flex" width="100%" flexWrap="wrap" paddingBottom="200px" onClick={handleClickBlank}>
                {
                  filteredFilesList.length > 0
                    ?
                    filteredFilesList.map(file =>
                      <FileItem
                        selectedUser={selectedUser}
                        fileName={file.entityName}
                        fileType={file.entitySubType}
                        isFolder={file.entityType === ENTITY_TYPE_DIRECTORY}
                        file={file}
                        selectedEntity={selectedEntity}
                        setSelectedEntity={setSelectedEntity}
                        selectedEntityDetails={selectedEntityDetails}
                        setSelectedEntityDetails={setSelectedEntityDetails}
                        handleDoubleClick={file.entityType === ENTITY_TYPE_DIRECTORY ? handleFolderDoubeClick.bind(this, file.entityId, file.entityName) : null}
                      />
                    )
                    :
                    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="250px">
                      <Typography sx={classes.noItemText}><FormattedMessage {...messages.noItems} /></Typography>
                    </Box>
                }
              </Box>
            </Box>
          </Box>
        </Box>

      </Box>
    </Box>
  );
}

FilesRecycleBin.propTypes = {
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

export default compose(withConnect)(FilesRecycleBin);
