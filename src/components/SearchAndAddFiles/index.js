/**
 *
 * SearchAndAddFiles
 *
 */

import React, { useState, useEffect } from 'react';
import { Box, Typography, Divider, Button, InputAdornment, Tooltip, Checkbox, Menu, LinearProgress } from '@mui/material';
import { TextFieldOverridden as TextField } from '../TextFieldOverridden/index';
import { Search, ArrowBackIos } from '@mui/icons-material';
import { FilterAlt } from '../../icons/extraIcons';
import styles from './styles';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import GalleryService from '../../Api/Services/files/galleryService';
import FileItem from '../../components/FileItem';
import { FILE_TYPE_DOCUMENT, FILE_TYPE_FOLDER, FILE_TYPE_IMAGE, FILE_TYPE_VIDEO, ENTITY_TYPE_DIRECTORY, ENTITY_TYPE_FILE } from '../../utils/constants';
import { useSelector } from 'react-redux';

function SearchAndAddFiles(props) {

  const { handleClose, selectedUser, handleDone, selectionLimit, fileTypeLimit, excludeIds } = props
  const classes = styles;

  const [history, setHistory] = useState([])
  const [fileList, setFileList] = useState([])
  const [filteredFilesList, setFilteredList] = useState([])
  const [loading, SetLoading] = useState(false)
  const [appliedFilters, setAppliedFilters] = useState(fileTypeLimit && fileTypeLimit.length ? [FILE_TYPE_FOLDER, ...fileTypeLimit] : [])
  const [searchKeyword, setSearchKeyword] = useState('')
  const [anchorFilter, setAnchorFilter] = useState(null);
  const [selectedEntity, setSelectedEntity] = useState([])
  const [selectedEntityDetails, setSelectedEntityDetails] = useState([])

  const selected_space = useSelector(state => state.current_selected_data.selected_space)
  const selected_project = useSelector(state => state.current_selected_data.selected_project)


  useEffect(() => {
    getContentsOfCurrentDirectory(null)
  }, [])

  const handleMenuClickFilter = (event) => {
    setAnchorFilter(event.currentTarget);
  };

  const handleCloseFilterMenu = () => {
    setAnchorFilter(null);
  };


  const apiErrorHandler = (err) => {
    if (err.response !== undefined && err.response !== null) {
      if (err.response.data === null)
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
      else if ("schema_errors" in err.response.data)
        props.tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error')
      else if ("message" in err.response.data)
        props.tostAlert(err.response.data.message, 'error')
      else
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error')
    }
    else {
      if (err.message === "Network Error")
        props.tostAlert(<FormattedMessage {...messages.serverError} />, 'error')
    }
  }

  const getContentsOfCurrentDirectory = (parentId) => {
    if (selectedUser) {
      setFileList([])
      setFilteredList([])
      setSelectedEntity([])
      setSelectedEntityDetails([])
      SetLoading(true)

      const accID = props.selectedUser.root_account_id
      const subscriberId = props.selectedUser.subscriber_id
      const subscriptionId = props.selectedUser.subscription_id
      const schemaId = selected_project.payload.__auto_id__

      GalleryService
        .getFolderContents(accID, subscriberId, subscriptionId, schemaId, parentId, null)
        .then(res => {
          const entityFolders = []
          res.data.folders.forEach(folder => {
            if (folder.is_hidden)
              return
            entityFolders.push({
              entityId: folder.id,
              entityType: ENTITY_TYPE_DIRECTORY,
              entityName: folder.folder_name,
              entityRootId: folder.parent_folder_id,
              entitySubType: FILE_TYPE_FOLDER,
              entityThumbnail: null,
            })
          })
          const entityFiles = []
          res.data.files.forEach(file => {
            if (file.is_hidden)
              return
            if (excludeIds && excludeIds.length && excludeIds.length > 0 && excludeIds.includes(file.id))
              return false
            entityFiles.push({
              entityId: file.id,
              entityType: ENTITY_TYPE_FILE,
              entityName: file.file_attributes.file_name ?? 'Untitled',
              entityRootId: file.folder_id,
              entitySubType: file.file_type,
              entityThumbnail: file.thumbnail_url,
            })
          })
          setFileList([...entityFolders, ...entityFiles])
          filterFiles(appliedFilters, [...entityFolders, ...entityFiles])
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

  const filterFiles = (filterApplied, masterList) => {
    console.log("applied filter", filterApplied)
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

  const handleFolderClick = (folder) => {
    if (folder.entityType === ENTITY_TYPE_FILE)
      return false
    const historyTemp = [...history]
    historyTemp.push(folder.entityId)
    setHistory(historyTemp)
    getContentsOfCurrentDirectory(folder.entityId)
  }

  const handleFolderBack = () => {
    const historyTemp = [...history]
    historyTemp.pop()
    setHistory(historyTemp)
    getContentsOfCurrentDirectory(historyTemp[historyTemp.length - 1])
  }

  const saveSelectedFiles = () => {
    if (selectedEntity.length > 0)
      handleDone(selectedEntity, selectedEntityDetails)
    handleClose()
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

  const handleClickBlank = () => {
    setSelectedEntity([])
    setSelectedEntityDetails([])
  }

  const handleClearFilter = () => {
    setAppliedFilters([])
    filterFiles([])
    setSearchKeyword('')
  }

  const searchFnc = (key, filtersApplied) => {
    setSearchKeyword(key)
    const res = fileList.filter(item => {
      if (item.entityName.toUpperCase().match(key.toUpperCase()) !== null)
        return item
    })
    filterFiles(filtersApplied, res)
  }

  return (
    <Box display="flex" flexDirection="column" justifyContent="space-between" overflow="auto" width="550px" height="100%" sx={classes.root}>
      <Box>
        <Box px="20px" py="15px" marginTop="20px" display="flex" justifyContent="space-between">
          <Box>
            <Typography sx={classes.addObjectiveHeading}><FormattedMessage {...messages.searchAndAddHeading} /></Typography>
          </Box>
          <Box>
            <Button disableElevation size="small" variant="contained" sx={classes.cancelBtn} onClick={handleClose}>
              <FormattedMessage {...messages.cancelBtn} />
            </Button>
            <Button disableElevation size="small" variant="contained" color="secondary" sx={classes.saveBtn} onClick={saveSelectedFiles} >
              <FormattedMessage {...messages.saveBtn} />
            </Button>
          </Box>
        </Box>
        <Box height="100%" mt="20px" paddingX="10px">
          <Box display="flex" flexDirection="column" width="100%">
            <Box my="10px">
              <TextField
                placeholder="Search Files"
                id="searchField_in_FilesList"
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
                      <Tooltip title="Search Files" >
                        <Search />
                      </Tooltip>
                    </InputAdornment>
                  )
                }}
              />
            </Box>
            <Box display="flex" flexDirection="column" width="100%" height="100%">
              <Box display="flex" alignItems="center" width="100%" marginY="10px">
                <FilterAlt color="secondary" onClick={handleMenuClickFilter} sx={classes.filterIcon} />
                {
                  appliedFilters.length === 0 || appliedFilters.length === 4
                    ?
                    <Typography sx={classes.filterText}><FormattedMessage {...messages.allFIles} /></Typography>
                    :
                    <Typography sx={classes.filterTextClick} onClick={handleClearFilter}><FormattedMessage {...messages.clearFilter} /></Typography>
                }
              </Box>
              {
                loading && <LinearProgress />
              }
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
                  horizontal: "left",
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
              <Divider width="100%" />
              {
                loading === false && history && history.length > 0
                  ?
                  <Box display="flex" sx={classes.pointerClick} onClick={handleFolderBack} margin="20px">
                    <Box marginRight="20px">
                      <ArrowBackIos />
                    </Box>
                    <Typography sx={classes.folderName}><FormattedMessage {...messages.back} /></Typography>
                  </Box>
                  :
                  ''
              }
              <Box display="flex" width="100%" flexWrap="wrap" paddingBottom="100px" overflow="auto" onClick={handleClickBlank}>
                {
                  filteredFilesList.length > 0
                    ?
                    filteredFilesList.map(file =>
                      <FileItem
                        fileName={file.entityName}
                        fileType={file.entitySubType}
                        isFolder={file.entityType === ENTITY_TYPE_DIRECTORY}
                        file={file}
                        selectedEntity={selectedEntity}
                        setSelectedEntity={setSelectedEntity}
                        selectedEntityDetails={selectedEntityDetails}
                        setSelectedEntityDetails={setSelectedEntityDetails}
                        handleDoubleClick={file.entityType === ENTITY_TYPE_DIRECTORY ? handleFolderClick.bind(this, file) : null}
                        customMargin="10px"
                        selectionLimit={selectionLimit}
                        fileTypeLimit={fileTypeLimit}
                      />
                    )
                    :
                    (
                      loading === false
                        ?
                        <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="250px">
                          <Typography sx={classes.noItemText}><FormattedMessage {...messages.noItems} /></Typography>
                        </Box>
                        :
                        ''
                    )
                }
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

SearchAndAddFiles.propTypes = {};

export default SearchAndAddFiles;
