/**
 *
 * CollectionListing
 *
 */

import React, { useState, forwardRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import styles from './styles'
import './style.css';
import messages from './messages';
import { TextFieldOverriddenWhite as TextField } from '../../../components/TextFieldOverridden/index';
import { Box, Typography, Paper, CircularProgress, MenuItem, CardMedia, Tabs, Tab, Divider } from '@mui/material';
import { AddBox, ArrowDownward, ShareOutlined, LanguageOutlined, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, RefreshOutlined, DescriptionOutlined } from '@mui/icons-material';
import { getCollectionLabel } from '../../../Api/Services/collection/collectionUtilityServices';
import CollectionItemsService from '../../../Api/Services/collection/collectionItemsService';
// import MaterialTable from 'material-table';
import LoadingOverlay from 'react-loading-overlay';
import topbar from 'topbar';
import { validate } from 'uuid';
import { useSelector } from 'react-redux';
import EnhancedCustomTable from '../../../components/EnhancedCustomTable';
import { useAppContext } from '../../../context/AppContext';

export function CollectionListing(props) {

  const { selectedCollection, languageList, setEditObj, setListOrAdd, setOtherItemsList } = props
  const { selectedProject } = useAppContext();

  const classes = styles;

  const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox sx={classes.actionIconAdd} {...props} ref={ref} />),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
    Delete: forwardRef((props, ref) => <DeleteOutline sx={classes.actionIcon} {...props} ref={ref} />),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    Edit: forwardRef((props, ref) => <Edit sx={classes.actionIcon} {...props} ref={ref} />),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  };

  function a11yProps(index) {
    return {
      id: `scrollable-force-tab-${index}`,
      'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
  }

  const [state, setState] = useState({
    columns: [],
    data: [],
  });

  const [stateDraft, setStateDraft] = useState({
    columns: [],
    data: [],
  });

  const [loading, SetLoading] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("en")
  const [selectedLanguageDraft, setSelectedLanguageDraft] = useState("en")
  const [fieldMap, setFieldMap] = useState()
  const [selectedCollectionId, setSelectedCollectionId] = useState([])
  const [selectedDraftCollectionId, setSelectedDraftCollectionId] = useState([])
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (selectedCollection) {
      SetLoading(true)
      topbar.show()
      fetchCollectionItems()
      setEditObj()
      setSelectedCollectionId([])
      setSelectedDraftCollectionId([])
    }
  }, [selectedCollection])

  useEffect(() => {
    if (selectedLanguage && selectedLanguageDraft && selectedCollection) {
      getListFields()
    }
  }, [selectedLanguage, selectedLanguageDraft, selectedCollection])

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const getListFields = () => {
    if (!(selectedCollection.display_view_config?.list?.default_view?.fields))
      return []
    if (
      selectedCollection.display_view_config.list.default_view.fields == null ||
      selectedCollection.display_view_config.list.default_view.fields.length === 0
    )
      return []
    const fieldMap = {}
    selectedCollection.fields_list.forEach(field => {
      fieldMap[field.field_path_pattern] = field
    })
    const retArr = []
    selectedCollection.display_view_config.list.default_view.fields.forEach(listField => {
      if (!fieldMap[listField.field_path_pattern])
        return
      if (["rich_text", "relation", "component"].includes(fieldMap[listField.field_path_pattern].field_type))
        return
      if (fieldMap[listField.field_path_pattern].field_type === 'media')
        retArr.push({
          title: getCollectionLabel(fieldMap[listField.field_path_pattern].field_name, fieldMap[listField.field_path_pattern].localized_texts, selectedLanguage),
          field: fieldMap[listField.field_path_pattern].field_name,
          render: rowData => {
            return (
              <Box
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50px',
                  width: '90px',
                  backgroundColor: '#D8D8D8',
                  borderRadius: 8
                }}>
                {
                  fieldMap[listField.field_path_pattern].settings.media_type === 'images' || fieldMap[listField.field_path_pattern].settings.media_type === 'videos'
                    ?
                    <CardMedia
                      sx={classes.mediaCard}
                      component="img"
                      alt={""}
                      title="Thumbnail"
                      image={rowData[fieldMap[listField.field_path_pattern].field_name] && rowData[fieldMap[listField.field_path_pattern].field_name][0] && rowData[fieldMap[listField.field_path_pattern].field_name][0].thumbnail_url}
                    />
                    :
                    <DescriptionOutlined color='secondary' />
                }
              </Box>
            )
          }
        })
      else if (fieldMap[listField.field_path_pattern].field_type === 'text')
        retArr.push({
          title: getCollectionLabel(fieldMap[listField.field_path_pattern].field_name, fieldMap[listField.field_path_pattern].localized_texts, selectedLanguage),
          field: fieldMap[listField.field_path_pattern].field_name,
          render: rowData => {
            if (rowData[fieldMap[listField.field_path_pattern].field_name] != null && typeof rowData[fieldMap[listField.field_path_pattern].field_name] === "object") {
              if (typeof rowData[fieldMap[listField.field_path_pattern].field_name][selectedLanguage] === "object")
                return "BAD_DATA_FOUND - REMOVE COLLECTION ITEM AND ADD AGAIN"
              return rowData[fieldMap[listField.field_path_pattern].field_name][selectedLanguage]
            }
            return rowData[fieldMap[listField.field_path_pattern].field_name]
          }
        })
      else if (fieldMap[listField.field_path_pattern].field_type === 'list')
        retArr.push({
          title: getCollectionLabel(fieldMap[listField.field_path_pattern].field_name, fieldMap[listField.field_path_pattern].localized_texts, selectedLanguage),
          field: fieldMap[listField.field_path_pattern].field_name,
          render: rowData => {
            if (rowData[fieldMap[listField.field_path_pattern].field_name] != null && typeof rowData[fieldMap[listField.field_path_pattern].field_name] === "string") {
              if (!(fieldMap[listField.field_path_pattern].settings.field_values[selectedLanguage]))
                return rowData[fieldMap[listField.field_path_pattern].field_name]
              const availableValues = fieldMap[listField.field_path_pattern].settings.field_values[selectedLanguage].split("\n")
              const selectedIndex = rowData[fieldMap[listField.field_path_pattern].field_name].replaceAll("__index__", "")
              if (isNaN(parseInt(selectedIndex)))
                return rowData[fieldMap[listField.field_path_pattern].field_name]
              else
                return availableValues[parseInt(selectedIndex)]
            }
            else if (rowData[fieldMap[listField.field_path_pattern].field_name] != null
              && typeof rowData[fieldMap[listField.field_path_pattern].field_name] === "object"
              && rowData[fieldMap[listField.field_path_pattern].field_name].length) {
              if (!(fieldMap[listField.field_path_pattern].settings.field_values[selectedLanguage]))
                return rowData[fieldMap[listField.field_path_pattern].field_name]
              const availableValues = fieldMap[listField.field_path_pattern].settings.field_values[selectedLanguage].split("\n")
              const selectedIndexArr = rowData[fieldMap[listField.field_path_pattern].field_name]
              const resArr = []
              for (const selectedIndexRaw of selectedIndexArr) {
                const selectedIndex = selectedIndexRaw.replaceAll("__index__", "")
                if (isNaN(parseInt(selectedIndex)))
                  continue
                else
                  resArr.push(availableValues[parseInt(selectedIndex)])
              }
              return resArr.join(",")
            }
            return rowData[fieldMap[listField.field_path_pattern].field_name]
          }
        })
      else
        retArr.push({
          title: getCollectionLabel(fieldMap[listField.field_path_pattern].field_name, fieldMap[listField.field_path_pattern].localized_texts, selectedLanguage),
          field: fieldMap[listField.field_path_pattern].field_name
        })
    }
    )
    setState(prev => ({
      columns: [...retArr],
      data: [...prev.data]
    }))
    setStateDraft(prev => ({
      columns: [...retArr],
      data: [...prev.data]
    }))
    setFieldMap(fieldMap)
  }

  const fetchCollectionItems = async () => {
    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const pluralId = selectedCollection.api_prural_id
    const version = selectedCollection.version
    const schemaId = selectedProject.payload.__auto_id__
    SetLoading(true)
    topbar.show()
    const dataTemp = []
    const dataTempDraft = []
    const dataTempOther = []
    let lastKey = null
    try {
      do {
        const res = await CollectionItemsService.getItemsBySingularId(accID, accID, pluralId, version, schemaId, "user", "public", `page_size=50&last_evaluated_key=${lastKey}&filters=null`)
        Object.keys(res.data).forEach(key => {
          if (validate(key)) {
            res.data[key].forEach(item => {
              dataTempOther.push(item.payload)
              if (item.entity_status && item.entity_status === "Published") {
                dataTemp.push({
                  ...item.payload,
                  update_key: item.update_key,
                  fieldListFromAPI: item.field_values.map(({ path, id, value }) => ({
                    path,
                    id,
                    value
                  })),
                  item_meta_details: {
                    payload_version: item.payload_version,
                    entity_status: item.entity_status
                  }
                })
              }
              else {
                dataTempDraft.push({
                  ...item.payload,
                  update_key: item.update_key,
                  fieldListFromAPI: item.field_values.map(({ path, id, value }) => ({
                    path,
                    id,
                    value
                  })),
                  item_meta_details: {
                    payload_version: item.payload_version,
                    entity_status: "Draft"
                  }
                })
              }
            })
          }
        })
        lastKey = res.data.last_evaluated_key != null && res.data.last_evaluated_key !== "" ? encodeURIComponent(JSON.stringify(res.data.last_evaluated_key)) : null
        // if (typeof res.data.last_evaluated_key !== "string" && typeof res.data.last_evaluated_key !== "number")
        //   lastKey = null
      }
      while (lastKey !== null);

      console.log("dataTemp", dataTemp)
      console.log("dataTempDraft", dataTempDraft)

      setState(prev => ({
        columns: [...prev.columns],
        data: [...dataTemp]
      }))
      setStateDraft(prev => ({
        columns: [...prev.columns],
        data: [...dataTempDraft]
      }))
      setOtherItemsList(dataTempOther)
    }
    catch (err) {
      console.log("Error occured while fetching list of collection Items", err)
      setState(prev => ({
        columns: [...prev.columns],
        data: []
      }))
      setStateDraft(prev => ({
        columns: [...prev.columns],
        data: []
      }))
      setOtherItemsList([])
    }
    finally {
      SetLoading(false)
      topbar.hide()
    }
  }

  const handleLanguageChange = (event) => {
    setSelectedLanguage(event.target.value)
  }

  const handleLanguageChangeDraft = (event) => {
    setSelectedLanguageDraft(event.target.value)
  }

  const handleSelectionChange = (allSelectedData) => {
    if (allSelectedData == null) {
      setSelectedCollectionId([])
    }
    else {
      setSelectedCollectionId(allSelectedData.map(item => item.__auto_id__))
      console.log("selectedCollectionId", selectedCollectionId)
    }
  }

  const handleSelectionChangeDraft = (allSelectedData) => {
    if (allSelectedData == null) {
      setSelectedDraftCollectionId([])
    }
    else {
      setSelectedDraftCollectionId(allSelectedData.map(item => item.__auto_id__))
      console.log("selectedDraftCollectionId", selectedDraftCollectionId)
    }
  }

  const deleteCollectionType = async () => {
    if (selectedCollectionId.length === 0)
      return
    SetLoading(true)
    topbar.show()
    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const singularId = selectedCollection.api_singular_id
    const version = selectedCollection.version
    const schemaId = selectedProject.payload.__auto_id__
    let errorCount = 0
    let defError = ""
    for (const collId of selectedCollectionId) {
      try {
        const res = await CollectionItemsService.deleteCollectionItem(accID, accID, singularId, version, schemaId, collId)
      }
      catch (err) {
        console.log("Error while deleting an item", err)
        errorCount += 1
        defError = err.response.data.message
        if (typeof defError === "object" && "message" in defError)
          defError = defError.message
      }
    }
    fetchCollectionItems()
    SetLoading(false)
    topbar.hide()
    if (errorCount > 0) {
      props.tostAlert(defError ?? <FormattedMessage {...messages.errorfullyDeletedAll} />, 'error')
    }
  }

  const deleteCollectionTypeDraft = async () => {
    if (selectedDraftCollectionId.length === 0)
      return
    SetLoading(true)
    topbar.show()
    const accID = props.selectedUser.root_account_id
    const subscriberId = props.selectedUser.subscriber_id
    const subscriptionId = props.selectedUser.subscription_id
    const singularId = selectedCollection.api_singular_id
    const version = selectedCollection.version
    const schemaId = selectedProject.payload.__auto_id__
    let errorCount = 0
    let defError = ""
    for (const collId of selectedDraftCollectionId) {
      try {
        const res = await CollectionItemsService.deleteCollectionItem(accID, accID, singularId, version, schemaId, collId)
      }
      catch (err) {
        console.log("Error while deleting an item", err)
        errorCount += 1
        defError = err.response.data.message
        if (typeof defError === "object" && "message" in defError)
          defError = defError.message
      }
    }
    fetchCollectionItems()
    SetLoading(false)
    topbar.hide()
    if (errorCount > 0) {
      props.tostAlert(defError ?? <FormattedMessage {...messages.errorfullyDeletedAll} />, 'error')
    }
  }

  return (
    <Box width="100%">

      {
        selectedCollection
          ?
          <Box display="flex" width="100%" pt={5} justifyContent="center">
            <Box width="95%" maxWidth="960px">
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
                  <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    indicatorColor="secondary"
                    textColor="secondary"
                    aria-label="scrollable force tabs example"
                    variant="scrollable"
                    scrollButtons="off"
                  >
                    <Tab key={0} id={"tabInCollectionList_index_" + 0} classes={{ root: classes.tab }} label={<FormattedMessage {...messages.publishedTab} />}  {...a11yProps(0)} />
                    <Tab key={1} id={"tabInCollectionList_index_" + 0} classes={{ root: classes.tab }} label={<FormattedMessage {...messages.draftTab} />}  {...a11yProps(1)} />
                  </Tabs>
                </Box>
                <Divider width="100%" />
                <div
                  role="tabpanel_in_collection_list_published"
                  style={{ width: '100%' }}
                  hidden={tabValue !== 0}
                  id={`scrollable-force-tabpanel_in_collection_list_published`}
                  aria-labelledby={`scrollable-force-tab_in_collection_list_published`}
                  key={"tabpanel_in_collection_list_published"}
                >
                  <Box sx={classes.refreshBtnBox}>
                    {
                      selectedCollection && selectedCollection.enable_localization
                        ?
                        <Box display="flex" alignItems="center">
                          <LanguageOutlined />
                          <Box width="150px" marginLeft="10px">
                            <TextField
                              variant="filled"
                              label=""
                              margin="normal"
                              name="language"
                              fullWidth
                              size="small"
                              select
                              id="language"
                              onChange={handleLanguageChange}
                              value={selectedLanguage}
                            >
                              {
                                languageList.map(lang => <MenuItem value={lang.value}>{lang.name}</MenuItem>)
                              }
                            </TextField>
                          </Box>
                        </Box>
                        :
                        <Box></Box>
                    }
                    <Box display="flex" alignItems="center">
                      {/* <Box sx={classes.cloneBtn} onClick={null}>
                  <ShareOutlined color='secondary' />
                  <Typography sx={classes.deleteText}><FormattedMessage {...messages.share} /></Typography>
                </Box> */}
                      <Box sx={classes.cloneBtn} onClick={deleteCollectionType}>
                        <DeleteOutline color='secondary' />
                        <Typography sx={classes.deleteText}><FormattedMessage {...messages.delete} /></Typography>
                      </Box>
                      <Box>
                        {
                          loading
                            ?
                            <CircularProgress size={20.5} sx={classes.loadingIcon} />
                            :
                            <RefreshOutlined sx={classes.refreshIcon} onClick={fetchCollectionItems} />
                        }
                      </Box>
                    </Box>
                  </Box>
                  <Box id="collectionListingTableDark">
                    {/* <MaterialTable
                      components={{
                        Container: props => <Paper {...props} elevation={0} sx={classes.tableRootPaper} />
                      }}
                      icons={tableIcons}
                      options={{
                        toolbar: false,
                        pageSize: 10,
                        headerStyle: {
                          backgroundColor: '#13171F',
                          color: '#FFF',
                          fontSize: 14,
                          height: '40px'
                        },
                        showFirstLastPageButtons: false,
                        selection: true,
                        selectionProps: rowData => ({
                          checked: selectedCollectionId.includes(rowData.__auto_id__),
                          color: 'primary'
                        })
                      }}
                      onSelectionChange={handleSelectionChange}
                      columns={state.columns}
                      data={state.data}
                      onRowClick={(event, rowData,) => {
                        setEditObj(rowData)
                        setListOrAdd('add')
                      }}
                    /> */}
                    <EnhancedCustomTable
                      columns={state.columns}
                      data={state.data}
                      onSelectionChange={handleSelectionChange}
                      onRowClick={(rowData) => {
                        setEditObj(rowData)
                        setListOrAdd('add')
                      }}
                    >
                    </EnhancedCustomTable>
                  </Box>
                </div>
                <div
                  role="tabpanel_in_collection_list_draft"
                  style={{ width: '100%' }}
                  hidden={tabValue !== 1}
                  id={`scrollable-force-tabpanel_in_collection_list_draft`}
                  aria-labelledby={`scrollable-force-tab_in_collection_list_draft`}
                  key={"tabpanel_in_collection_list_draft"}
                >
                  <Box sx={classes.refreshBtnBox}>
                    {
                      selectedCollection && selectedCollection.enable_localization
                        ?
                        <Box display="flex" alignItems="center">
                          <LanguageOutlined />
                          <Box width="150px" marginLeft="10px">
                            <TextField
                              variant="filled"
                              label=""
                              margin="normal"
                              name="languageDraft"
                              fullWidth
                              size="small"
                              select
                              id="language"
                              onChange={handleLanguageChangeDraft}
                              value={selectedLanguageDraft}
                            >
                              {
                                languageList.map(lang => <MenuItem value={lang.value}>{lang.name}</MenuItem>)
                              }
                            </TextField>
                          </Box>
                        </Box>
                        :
                        <Box></Box>
                    }
                    <Box display="flex" alignItems="center">
                      {/* <Box sx={classes.cloneBtn} onClick={null}>
                  <ShareOutlined color='secondary' />
                  <Typography sx={classes.deleteText}><FormattedMessage {...messages.share} /></Typography>
                </Box> */}
                      <Box sx={classes.cloneBtn} onClick={deleteCollectionTypeDraft}>
                        <DeleteOutline color='secondary' />
                        <Typography sx={classes.deleteText}><FormattedMessage {...messages.delete} /></Typography>
                      </Box>
                      <Box>
                        {
                          loading
                            ?
                            <CircularProgress size={20.5} sx={classes.loadingIcon} />
                            :
                            <RefreshOutlined sx={classes.refreshIcon} onClick={fetchCollectionItems} />
                        }
                      </Box>
                    </Box>
                  </Box>
                  <Box id="collectionListingTableDarkDraft">
                    {/* <MaterialTable
                      components={{
                        Container: props => <Paper {...props} elevation={0} sx={classes.tableRootPaper} />
                      }}
                      icons={tableIcons}
                      options={{
                        toolbar: false,
                        pageSize: 10,
                        headerStyle: {
                          backgroundColor: '#13171F',
                          color: '#FFF',
                          fontSize: 14,
                          height: '40px'
                        },
                        showFirstLastPageButtons: false,
                        selection: true,
                        selectionProps: rowData => ({
                          checked: selectedDraftCollectionId.includes(rowData.__auto_id__),
                          color: 'primary'
                        })
                      }}
                      onSelectionChange={handleSelectionChangeDraft}
                      columns={stateDraft.columns}
                      data={stateDraft.data}
                      onRowClick={(event, rowData,) => {
                        setEditObj(rowData)
                        setListOrAdd('add')
                      }}
                    /> */}
                    <EnhancedCustomTable
                      columns={stateDraft.columns}
                      data={stateDraft.data}
                      onSelectionChange={handleSelectionChangeDraft}
                      onRowClick={(rowData) => {
                        setEditObj(rowData)
                        setListOrAdd('add')
                      }}
                    >
                    </EnhancedCustomTable>
                  </Box>
                </div>
              </LoadingOverlay>
            </Box>
          </Box>
          :
          <Box display="flex" width="100%" pt={5} justifyContent="center">
            <Box display="flex" width="100%" height="200px" justifyContent="center" alignItems="center">
              <FormattedMessage {...messages.noCollection} />
            </Box>
          </Box>
      }
    </Box>
  );
}

CollectionListing.propTypes = {
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

export default compose(withConnect)(CollectionListing);
