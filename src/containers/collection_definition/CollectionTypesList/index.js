/**
 *
 * CollectionTypesList
 *
 */

import React, { useState, useEffect } from 'react';
import styles from './styles'
import './style.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import messages from './messages';
import topbar from 'topbar';
import qs from 'qs';
import moment from 'moment';

import { Box, Button, InputAdornment, Tooltip, Typography, CircularProgress, Tabs, Tab, Modal } from '@mui/material';
import { DeleteOutline, Search, RefreshOutlined } from '@mui/icons-material'

import { TextFieldOverriddenWhite as TextField } from '../../../components/TextFieldOverridden/index';
import EnhancedCustomTable from '../../../components/EnhancedCustomTable/custom';
import CollectionDeleteWarning from '../../../components/CollectionDeleteWarning/index';
import CollectionTypesService from '../../../Api/Services/collection/collectionTypesService';
import { APPLICATION_CODE_PLURAL } from '../../../utils/constants';
import getMainStyles from '../../../styles/getStyles';
import LoadingOverlay from 'react-loading-overlay';
import { useOutletContext } from 'react-router-dom';
import Chatbot from '../../../components/Chatbot';


function CollectionTypesList() {
  const classes = styles;
  const mainStyles = getMainStyles();

  const { centralLoadingFlags, tostAlert, selectedUser, location, navigate, collectionTypeList, fetchCollectionTypes,
    fetchPublishedCollection, fieldSetList, fetchFieldSets, fetchPublishedFieldset } = useOutletContext();

  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const [state, setState] = useState({
    columns: [
      {
        id: 'planname',
        title: <FormattedMessage {...messages.collectionTypes} />,
        field: 'Name',
        defaultSort: 'desc',
        width: '250px'
      },
      {
        id: 'status',
        title: <FormattedMessage {...messages.status} />,
        field: 'Status',
        width: '120px'
      },
      {
        id: 'lastpublished',
        title: <FormattedMessage {...messages.lastPublished} />,
        field: 'Last published',
        type: 'date',
        width: '180px',
        defaultSort: 'desc',
        filtering: false,
        customSort: (a, b) => {
          const timestampA = a.lastpublished === null || a.lastpublished === '' || a.lastpublished === '-' ? moment().unix() : moment(a.lastpublished).unix()
          const timestampB = b.lastpublished === null || b.lastpublished === '' || b.lastpublished === '-' ? moment().unix() : moment(b.lastpublished).unix()
          return timestampA - timestampB
        }
      },
    ],
    data: [],
  });

  const [stateFieldSet, setStateFieldSet] = useState({
    columns: [
      {
        id: 'planname',
        title: <FormattedMessage {...messages.fieldSet} />,
        field: 'Name',
        defaultSort: 'desc',
        width: '250px'
      },
      {
        id: 'status',
        title: <FormattedMessage {...messages.status} />,
        field: 'Status',
        width: '120px'
      },
      {
        id: 'lastpublished',
        title: <FormattedMessage {...messages.lastPublished} />,
        field: 'Last published',
        type: 'date',
        width: '180px',
        defaultSort: 'desc',
        filtering: false,
        customSort: (a, b) => {
          const timestampA = a.lastpublished === null || a.lastpublished === '' || a.lastpublished === '-' ? moment().unix() : moment(a.lastpublished).unix()
          const timestampB = b.lastpublished === null || b.lastpublished === '' || b.lastpublished === '-' ? moment().unix() : moment(b.lastpublished).unix()
          return timestampA - timestampB
        }
      },
    ],
    data: [],
  });

  const [loading, SetLoading] = useState(false)
  const [searchRes, setSearchRes] = useState(state.data)
  const [searchResFieldSet, setSearchResFieldSet] = useState(state.data)
  const [selectedRowData, setSelectedRowData] = useState([])
  const [selectedRowDataDetails, setSelectedRowDataDetails] = useState([])
  const [selectedRowDataField, setSelectedRowDataField] = useState([])
  const [selectedRowDataFieldDetails, setSelectedRowDataFieldDetails] = useState([])
  const [tabValue, setTabValue] = useState(location && location?.preSelect && location?.preSelect === 'fieldSet' ? 1 : 0)
  const [warningModel, setWarningModel] = useState(false)
  const [warningData, setWarningData] = useState()

  useEffect(() => {
    const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
    if (collectionTypeList && collectionTypeList.length) {

      const collTypes = []
      let redirectObj = null
      const isRedirectReq = "redirect_mode" in queryParams && queryParams.redirect_mode === "collection" && "collId" in queryParams

      collectionTypeList.forEach(item => {

        if (isRedirectReq && queryParams.collId === item.id) {
          redirectObj = { ...item }
        }

        if (!item.system_predefined || item.api_prural_id === APPLICATION_CODE_PLURAL.lookups) {
          collTypes.push({
            id: item.id,
            planname: item.entity_name,
            label: item.entity_name,
            status: item.entity_status,
            lastpublished: item.entity_status === "Published" ? item.latest_published_time : '-',
            collTypeObj: item
          })
        }

      })

      setState({ columns: [...state.columns], data: collTypes })
      setSearchRes(collTypes)

      if (isRedirectReq && redirectObj) {
        navigate(
          '/collection-types/edit', {
          state: {
            collTypeObj: redirectObj,
            editName: redirectObj.entity_name
          }
        }
        )
      }

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionTypeList])

  useEffect(() => {
    const queryParams = qs.parse(location.search, { ignoreQueryPrefix: true })
    if (fieldSetList && fieldSetList.length) {
      const fieldSets = []
      let redirectObj = null
      const isRedirectReq = "redirect_mode" in queryParams && queryParams.redirect_mode === "field_set" && "collId" in queryParams

      fieldSetList.forEach(item => {
        if (isRedirectReq && queryParams.collId === item.id) {
          redirectObj = { ...item }
        }
        if (!item.system_predefined || item.api_prural_id === APPLICATION_CODE_PLURAL.lookups) {
          fieldSets.push({
            id: item.id,
            planname: item.entity_name,
            status: item.entity_status,
            lastpublished: item.latest_published_time,
            collTypeObj: item
          })
        }
      })

      setStateFieldSet({ columns: [...stateFieldSet.columns], data: fieldSets })
      setSearchResFieldSet(fieldSets)

      if (isRedirectReq && redirectObj) {
        navigate(
          '/collection-types/field-set/edit',
          {
            state: {
              collTypeObj: redirectObj,
              editName: redirectObj.entity_name
            }
          })
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fieldSetList])

  const handleErrorModelOpen = () => {
    setWarningModel(true)
  }

  const handleErrorModelClose = () => {
    setWarningModel(false)
    setSelectedRowData([])
    setSelectedRowDataDetails([])
    setSelectedRowDataField([])
    setSelectedRowDataFieldDetails([])
  }

  const searchFnc = (key) => {
    const res = state.data.filter(item => {
      if (item.planname.toUpperCase().match(key.toUpperCase()) !== null)
        return item
    })
    setSearchRes(res)
  }

  const searchFncFieldSet = (key) => {
    const res = stateFieldSet.data.filter(item => {
      if (item.planname.toUpperCase().match(key.toUpperCase()) !== null)
        return item
    })
    setSearchResFieldSet(res)
  }

  const handleSelectionChange = (selectedData) => {
    setSelectedRowData(selectedData)
    setSelectedRowDataDetails(selectedData)
  }

  const handleSelectionChangeFieldSet = (selectedData) => {
    setSelectedRowDataField(selectedData)
    setSelectedRowDataFieldDetails(selectedData)
  }

  const handleRefresh = (type) => {
    if (type === "collection") {
      fetchCollectionTypes()
      fetchPublishedCollection()
    }
    if (type === "fieldset") {
      fetchFieldSets()
      fetchPublishedFieldset()
    }
  }

  const getRedirectPathForError = (error, collectionDetails) => {
    switch (error.message.code) {
      case 'CLER34':
      case 'CLER37':
        return error.message.data.map(item => {
          return ({
            name: item.collection.name ?? '',
            path: 'collection-types?redirect_mode=collection&collId=' + item.collection.id
          })
        }
        )
      case 'CLER38':
        return error.message.data.map(item => {
          return ({
            name: item.fieldset.name ?? '',
            path: 'collection-types?redirect_mode=field_set&collId=' + item.fieldset.id
          })
        }
        )
      case 'CLER36':
        return [{
          name: '',
          path: 'collection-types?redirect_mode=field_set&collId=' + collectionDetails.id
        }]
      case 'CLER35':
        return [
          {
            name: '',
            path: "collections/" + collectionDetails.api_singular_id
          }
        ]
      default:
        return []
    }
  }

  const deleteCollectionType = async () => {
    if (selectedRowDataDetails.length === 0)
      return
    SetLoading(true)
    topbar.show()
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const warningNames = {}
    const errorNames = []
    const successNames = []
    let defError = null
    for (const coll of selectedRowDataDetails) {
      const collId = coll.id
      try {
        const res = await CollectionTypesService.deleteCollectionType(accID, subscriptionId, subscriberId, collId)
        if (res.data.success)
          successNames.push(coll.entity_name)
      }
      catch (err) {
        if (err.response.status === 422 && err.response.data.message && err.response.data.message.code) {
          if (err.response.data.message.code in warningNames)
            warningNames[err.response.data.message.code].push({
              collectionName: coll.entity_name,
              errorCode: err.response.data.message.code,
              defaultMessage: err.response.data.message.message,
              redirectPath: getRedirectPathForError(err.response.data, coll)
            })
          else
            warningNames[err.response.data.message.code] = [({
              collectionName: coll.entity_name,
              errorCode: err.response.data.message.code,
              defaultMessage: err.response.data.message.message,
              redirectPath: getRedirectPathForError(err.response.data, coll)
            })]
        }
        else {
          errorNames.push(coll.entity_name)
          if (err.response.data.message)
            defError = err.response.data.message.message
        }
      }
    }
    fetchCollectionTypes()
    SetLoading(false)
    topbar.hide()
    if (Object.keys(warningNames).length === 0) {
      if (errorNames.length === 0) {
        tostAlert(<FormattedMessage {...messages.successfullyDeletedAll} />, 'success')
        return
      }
      else if (successNames.length === 0) {
        tostAlert(defError ?? <FormattedMessage {...messages.errorfullyDeletedAll} />, 'error')
        return
      }
    }
    setWarningData({
      successNames,
      warningNames,
      errorNames,
      context: 'collection'
    })
    handleErrorModelOpen()
  }

  const deleteFieldSet = async () => {
    if (selectedRowDataFieldDetails.length === 0)
      return
    SetLoading(true)
    topbar.show()
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const warningNames = {}
    const errorNames = []
    const successNames = []
    let defError = null
    for (const coll of selectedRowDataFieldDetails) {
      const collId = coll.id
      try {
        const res = await CollectionTypesService.deleteFieldSet(accID, subscriptionId, subscriberId, collId)
        if (res.data.success)
          successNames.push(coll.entity_name)
      }
      catch (err) {
        if (err.response.status === 422 && err.response.data.message && err.response.data.message.code) {
          if (err.response.data.message.code in warningNames)
            warningNames[err.response.data.message.code].push({
              collectionName: coll.entity_name,
              errorCode: err.response.data.message.code,
              defaultMessage: err.response.data.message.message,
              redirectPath: getRedirectPathForError(err.response.data, coll)
            })
          else
            warningNames[err.response.data.message.code] = [({
              collectionName: coll.entity_name,
              errorCode: err.response.data.message.code,
              defaultMessage: err.response.data.message.message,
              redirectPath: getRedirectPathForError(err.response.data, coll)
            })]
        }
        else {
          errorNames.push(coll.entity_name)
          if (err.response.data.message)
            defError = err.response.data.message.message
        }
      }
    }
    fetchFieldSets()
    SetLoading(false)
    topbar.hide()
    if (Object.keys(warningNames).length === 0) {
      if (errorNames.length === 0) {
        tostAlert(<FormattedMessage {...messages.successfullyDeletedAll} />, 'success')
        return
      }
      else if (successNames.length === 0) {
        tostAlert(defError ?? <FormattedMessage {...messages.errorfullyDeletedAll} />, 'error')
        return
      }
    }
    setWarningData({
      successNames,
      warningNames,
      errorNames,
      context: 'fieldSet'
    })
    handleErrorModelOpen()
  }

  return (
    <Box sx={classes.mainContainer}>
      <Box sx={classes.cardContainer}>

        <Chatbot chatbot_type={"appflyte_ddl"} />

        <Box sx={classes.breadButtonsBox}>
          {tabValue === 0
            ?
            <Button
              disableElevation
              size="small"
              variant="contained"
              sx={classes.createCollectionTypeBtn}
              onClick={() => {
                const currentPath = location.pathname
                if (currentPath.charAt(currentPath.length - 1) === '/') {
                  navigate(currentPath + "add")
                } else {
                  navigate(currentPath + "/add")
                }
              }}>
              <FormattedMessage {...messages.createPlan} />
            </Button>
            :
            <Button
              disableElevation
              size="small"
              variant="contained"
              color="secondary"
              sx={classes.createCollectionTypeBtn}
              onClick={() => {
                const currentPath = location.pathname
                if (currentPath.charAt(currentPath.length - 1) === '/') {
                  navigate(currentPath + "field-set/add")
                } else {
                  navigate(currentPath + "/field-set/add")
                }
              }}>
              <FormattedMessage {...messages.addFieldSet} />
            </Button>
          }
        </Box>

        <LoadingOverlay
          active={loading}
          horizontal
          styles={{
            wrapper: {
              height: '100%',
              width: '100%'
            },
            overlay: (base) => ({
              ...base,
              background: 'rgba(0, 0, 0, 0.2)',
              zIndex: 1600,
              height: '100%',
              position: 'fixed'
            })
          }}>
          <Box pt={5} display="flex" justifyContent="center">

            <Box display="flex" flexDirection="column" justifyContent="center" width="85%" maxWidth="960px">

              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                  value={tabValue}
                  onChange={handleTabChange}
                  aria-label="scrollable force tabs example"
                  variant="scrollable"
                  scrollButtons={false}
                  sx={mainStyles.tabs}
                >
                  <Tab key={0} id={"tabInCollectionTypeList_index_" + 0} classes={{ root: classes.tab }} label={<FormattedMessage {...messages.collectionTypesTab} />}  {...a11yProps(0)} />
                  <Tab key={1} id={"tabInCollectionTypeList_index_" + 0} classes={{ root: classes.tab }} label={<FormattedMessage {...messages.fieldSetTab} />}  {...a11yProps(1)} />
                </Tabs>
              </Box>

              {tabValue === 0 &&
                <Box value={tabValue} index={0}>

                  <Box flex={1} my="20px">
                    <TextField
                      placeholder="Search"
                      variant='outlined'
                      fullWidth
                      size="small"
                      onChange={(evt) => {
                        searchFnc(evt.target.value)
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

                  <Box sx={classes.refreshBtnBox}>
                    {/* <Box sx={classes.cloneBtn} onClick={deleteCollectionType}>
                      <DeleteOutline color='secondary' />
                      <Typography sx={classes.deleteText}><FormattedMessage {...messages.delete} /></Typography>
                    </Box> */}
                    <Box>
                      {centralLoadingFlags && 'collectionTypes' in centralLoadingFlags && centralLoadingFlags.collectionTypes
                        ?
                        <CircularProgress size={20.5} sx={classes.loadingIcon} />
                        :
                        <RefreshOutlined sx={classes.refreshIcon} onClick={() => handleRefresh("collection")} />
                      }
                    </Box>
                  </Box>

                  <Box id="collectionTypeDarkTable">
                    <EnhancedCustomTable
                      data={searchRes}
                      columns={state.columns}
                      onSelectionChange={handleSelectionChange}
                      onRowClick={(rowData) => {
                        const currentPath = location.pathname
                        if (currentPath.charAt(currentPath.length - 1) === '/') {
                          navigate(currentPath + 'edit', {
                            state: {
                              collTypeObj: rowData.collTypeObj,
                              editName: rowData.collTypeObj.entity_name
                            }
                          })
                        } else {
                          navigate(currentPath + '/edit', {
                            state: {
                              collTypeObj: rowData.collTypeObj,
                              editName: rowData.collTypeObj.entity_name
                            }
                          })
                        }
                      }}
                    />
                  </Box>

                </Box>
              }

              {tabValue === 1 &&
                <Box value={tabValue} index={1}>
                  <Box flex={1} my="20px">
                    <TextField
                      placeholder="Search"
                      variant='outlined'
                      fullWidth
                      size="small"
                      onChange={(evt) => {
                        searchFncFieldSet(evt.target.value)
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
                  <Box sx={classes.refreshBtnBox}>
                    {/* <Box sx={classes.cloneBtn} onClick={deleteCollectionType}>
                      <DeleteOutline color='secondary' />
                      <Typography sx={classes.deleteText}><FormattedMessage {...messages.delete} /></Typography>
                    </Box> */}
                    <Box>
                      {
                        centralLoadingFlags && 'fieldSets' in centralLoadingFlags && centralLoadingFlags.fieldSets
                          ?
                          <CircularProgress size={20.5} sx={classes.loadingIcon} />
                          :
                          <RefreshOutlined sx={classes.refreshIcon} onClick={() => handleRefresh("fieldset")} />
                      }
                    </Box>
                  </Box>
                  <Box id="fieldSetDarkTable">
                    <EnhancedCustomTable
                      data={searchResFieldSet}
                      columns={stateFieldSet.columns}
                      onSelectionChange={handleSelectionChangeFieldSet}
                      onRowClick={(rowData) => {
                        const currentPath = location.pathname
                        if (currentPath.charAt(currentPath.length - 1) === '/') {
                          navigate(currentPath + 'field-set/edit', {
                            state: {
                              collTypeObj: rowData.collTypeObj,
                              editName: rowData.collTypeObj.entity_name
                            }
                          })
                        }
                        else {
                          navigate(currentPath + '/field-set/edit', {
                            state: {
                              collTypeObj: rowData.collTypeObj,
                              editName: rowData.collTypeObj.entity_name
                            }
                          })
                        }
                      }}
                    />
                  </Box>
                </Box>}

            </Box>
          </Box>
        </LoadingOverlay>

        <Modal
          open={warningModel}
          onClose={handleErrorModelClose}
          aria-labelledby="simple-modal-title-add-collType"
          aria-describedby="simple-modal-description-add-collType"
        >
          <CollectionDeleteWarning
            successNames={warningData ? warningData.successNames : []}
            warningNames={warningData ? warningData.warningNames : {}}
            errorNames={warningData ? warningData.errorNames : []}
            context={warningData ? warningData.context : 'collection'}
            successMsg={<FormattedMessage {...messages.succDelete} />}
            warningMsg={<FormattedMessage {...messages.warningDelete} />}
            errorMsg={<FormattedMessage {...messages.errDelete} />}
            handleClose={handleErrorModelClose}
            navigate={navigate}
          />
        </Modal>

      </Box>
    </Box>
  );
}

CollectionTypesList.propTypes = {
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

export default compose(withConnect)(CollectionTypesList);
