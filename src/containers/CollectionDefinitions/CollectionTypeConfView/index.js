/**
 *
 * CollectionTypeConfView
 *
 */

import React, { useState, useEffect, forwardRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import styles from './styles';
import { TextFieldOverriddenWhite as TextField } from '../../../components/TextFieldOverridden/index';
import { Box, Typography, Button, Paper, Menu, Modal, MenuItem } from '@mui/material';
import LoadingOverlay from 'react-loading-overlay';
import { AddBox, ArrowDownward, DragIndicator, Check, ChevronLeft, ChevronRight, Clear, DeleteOutline, Edit, LinkOutlined, PlaylistAddOutlined } from '@mui/icons-material';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import messages from './messages';
import AddFieldToListView from '../../../components/AddFieldToListView';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import CollectionTypesService from '../../../Api/Services/collection/collectionTypesService';
import topbar from 'topbar';
import { useOutletContext } from 'react-router-dom';

export function CollectionTypeConfView() {

  const { tostAlert, selectedUser, location, navigate, fetchCollectionTypes, fetchFieldSets } = useOutletContext();
  const { context } = location?.state

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

  const [loading, SetLoading] = useState(false)
  const [saveFlag, setSaveFlag] = useState(false)
  const [openAddFieldModal, setOpenAddFieldModal] = useState(false)
  const [anchorEditViewMenu, setAnchorEditViewMenu] = useState()
  const [modalMetaData, setModalMetaData] = useState(null)
  const [fieldList, setFieldList] = useState([])

  const [listViewFields, setListViewFields] = useState([])
  const [listViewFieldsIds, setListViewFieldsIds] = useState([])
  const [editViewFieldsIds, setEditViewFieldsIds] = useState([])
  const [editViewFields, setEditViewFields] = useState([])
  const [linkField, setLinkField] = useState('')

  useEffect(() => {
    if (location?.state?.publishedCollId && selectedUser) {
      SetLoading(true)
      topbar.show()
      const accID = selectedUser.root_account_id
      const subscriberId = selectedUser.subscriber_id
      const subscriptionId = selectedUser.subscription_id
      const collectionId = location?.state?.publishedCollId
      const confViewFetchFnc = context === 'fieldSet' ? CollectionTypesService.getFieldSetConfiguration : CollectionTypesService.getCollectionConfiguration
      confViewFetchFnc(accID, subscriptionId, subscriberId, collectionId)
        .then(res => {
          const patternMap = {}
          const listViewFieldsTmp = []
          const listViewFieldsIdTmp = []
          const editViewFieldsTmp = []
          const editViewFieldsIdTmp = []

          res.data.fields_list.forEach(item => {
            if (item.field_path_pattern === "$.__auto_id__")
              return false
            patternMap[item.field_path_pattern] = ({
              id: item.field_definition_id,
              fieldPathPattern: item.field_path_pattern,
              fieldName: item.field_name,
              fieldType: item.field_type,
              fieldSubType: item.field_sub_type,
              localized_texts: item.localized_texts
            })
          })

          // const defListViewName = res.data.display_view_config .list.default
          const defListViewName = "default_view"
          if (context !== 'fieldSet' && res.data.display_view_config?.list[defListViewName]?.fields) {
            res.data.display_view_config.list[defListViewName].fields.forEach(field => {
              if (patternMap[field.field_path_pattern] == null)
                return false
              listViewFieldsTmp.push(patternMap[field.field_path_pattern])
              listViewFieldsIdTmp.push(patternMap[field.field_path_pattern].id)
            })
          }

          // const defEditViewName = res.data.display_view_config .edit.default
          const defEditViewName = "default_view"
          if (res.data.display_view_config?.edit[defEditViewName]?.rows) {
            res.data.display_view_config.edit[defEditViewName].rows.forEach(row => {
              if (row.sections.length > 0 && row.sections[0].field_path_pattern === "$.__auto_id__")
                return false
              const columns = []
              row.sections.forEach(sec => {
                if (patternMap[sec.field_path_pattern] == null) {
                  // columns.push([])
                  return false
                }
                columns.push([patternMap[sec.field_path_pattern]])
                editViewFieldsIdTmp.push(patternMap[sec.field_path_pattern].id)
              })
              if (columns.length > 0)
                editViewFieldsTmp.push(columns)
            })
          }

          const fieldsListAPI = Object.values(patternMap).filter(x => {
            if (x.fieldPathPattern.lastIndexOf(".") > 1)
              return false
            return true
          })
          console.log("2d array", editViewFieldsTmp)
          const linkField = res.data.link_fields && res.data.link_fields.length && res.data.link_fields.length > 0 && res.data.link_fields[0] !== "$.__auto_id__" ? res.data.link_fields[0] : ''
          setListViewFields(listViewFieldsTmp)
          setListViewFieldsIds(listViewFieldsIdTmp)
          setEditViewFieldsIds(editViewFieldsIdTmp)
          setEditViewFields(editViewFieldsTmp)
          setFieldList(fieldsListAPI)
          setLinkField(linkField)
        })
        .catch(err => {
          console.log("Error occured while fetching collection type by id list for a coach", err)
          setFieldList([])
        })
        .finally(() => {
          SetLoading(false)
          topbar.hide()
        })
    }
  }, [location?.state && selectedUser])

  const handleLinkFieldChange = (event) => {
    setLinkField(event.target.value)
  }

  const addToListView = (value) => {
    setListViewFields(prevState => [...prevState, ...value])
    const allSelectedIds = value.map(x => x.id)
    setListViewFieldsIds(prevState => [...prevState, ...allSelectedIds])
    handleCloseFieldModal()
  }

  const addEditSection = (sectionCount) => {
    const tempArr = []
    let i
    for (i = 1; i <= sectionCount; i++)
      tempArr.push([])

    setEditViewFields(prevState => [...prevState, tempArr])
    handleCloseEditMenu()
  }

  const addFieldToSection = (row, col, value) => {
    const tempArr = [...editViewFields]
    tempArr[row][col].push(...value)
    setEditViewFieldsIds(prevState => [...prevState, value[0].id])
    setEditViewFields(tempArr)
    handleCloseFieldModal()
  }

  const removeEditField = (row, col, pos) => {
    const tempArr = [...editViewFields]
    const tempArr2 = [...editViewFieldsIds]
    const splicedItem = tempArr[row][col].splice(pos, 1)
    tempArr2.splice(tempArr2.indexOf(splicedItem[0].id), 1)
    setEditViewFields(tempArr)
    setEditViewFieldsIds(tempArr2)
  }

  const removeListField = (index) => {
    const tempArr = [...listViewFields]
    const tempArr2 = [...listViewFieldsIds]
    tempArr.splice(index, 1)
    tempArr2.splice(index, 1)
    setListViewFields(tempArr)
    setListViewFieldsIds(tempArr2)
  }

  const removeSection = (row, col) => {
    const tempArr = [...editViewFields]
    const removedIds = tempArr[row][col].map(x => x.id)
    tempArr[row].splice(col, 1)
    if (tempArr[row].length === 0)
      tempArr.splice(row, 1)
    const filteredEditIds = editViewFieldsIds.filter(x => !removedIds.includes(x))
    setEditViewFields(tempArr)
    setEditViewFieldsIds(filteredEditIds)
  }

  const handleAddEditFieldClick = (row, col, rowLength) => {
    setModalMetaData({
      row,
      col,
      rowLength
    })
    setOpenAddFieldModal(true)
  }

  const handleOpenFieldModal = () => {
    setModalMetaData(null)
    setOpenAddFieldModal(true)
  };

  const handleCloseFieldModal = () => {
    setModalMetaData(null)
    setOpenAddFieldModal(false)
  }

  const handleCloseEditMenu = () => {
    setAnchorEditViewMenu(null)
  }

  const handleOpenEditMenu = (event) => {
    setAnchorEditViewMenu(event.currentTarget);
  };

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  const onDragEndList = (result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      listViewFields,
      result.source.index,
      result.destination.index
    );

    setListViewFields(items);
  }

  const onDragEndEditParent = (result) => {
    if (!result.destination) {
      return;
    }

    const tempArr = editViewFields.map(x => [...x])

    const items = reorder(
      tempArr,
      result.source.index,
      result.destination.index
    );

    setEditViewFields(items);
  }

  const onDragEndEdit = (row, result) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      editViewFields[row],
      result.source.index,
      result.destination.index
    );

    const tempArr = [...editViewFields]
    tempArr[row] = items
    setEditViewFields(tempArr);

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

  const validate = (strictMode) => {
    if (context !== 'fieldSet' && listViewFields.length === 0)
      return ({
        status: false,
        message: <FormattedMessage {...messages.listViewEmpty} />,
        warning: "List view is empty, are you sure you want to continue ?"
      })
    if (context !== 'fieldSet' && linkField == '')
      return ({
        status: false,
        message: <FormattedMessage {...messages.linkFieldNotSet} />,
        warning: "Link field not selected, are you sure you want to continue ?"
      })

    // Checking for empty Row/ Col
    if (strictMode) {
      let flag = true
      for (const row of editViewFields) {
        if (row.length === 0) {
          flag = false
          break
        }
        for (const col of row) {
          if (col.length === 0) {
            flag = false
            break
          }
        }
      }
      if (flag === false)
        return ({
          status: false,
          message: <FormattedMessage {...messages.emptyRowCol} />,
          warning: "Empty Row/Column Found, are you sure you want to continue"
        })
    }

    return ({
      status: true,
      message: ''
    })
  }

  const cancelBtnHandler = () => {
    const validateStatus = validate(false)
    if (validateStatus.status === false) {
      const confirmStatus = window.confirm(validateStatus.warning)
      if (confirmStatus === false)
        return
    }
    else {
      if (editViewFieldsIds.length !== fieldList.length) {
        const confirmStatus = window.confirm("Some fields are not added in the Edit View, are you sure wo want to continue ?")
        if (confirmStatus === false)
          return
      }
    }

    const currentPath = location.pathname
    const targetPath = currentPath.replace(/(\/collection-types).*/, '$1')

    if (context === 'fieldSet') {
      navigate({
        pathname: targetPath,
        preSelect: 'fieldSet'
      })
    }
    else {
      navigate(targetPath)
    }
  }

  const saveConfiguration = () => {
    const validateStatus = validate(true)
    if (!validateStatus.status) {
      tostAlert(validateStatus.message, 'error')
      return false
    }
    else {
      if (editViewFieldsIds.length !== fieldList.length) {
        const confirmStatus = window.confirm("Some fields are not added in the Edit View, are you sure wo want to continue ?")
        if (confirmStatus === false)
          return false
      }
    }
    SetLoading(true)
    topbar.show()
    const accID = selectedUser.root_account_id
    const subscriberId = selectedUser.subscriber_id
    const subscriptionId = selectedUser.subscription_id
    const collectionId = location?.state?.publishedCollId
    const resObj = {
      edit: {
        rows: editViewFields.map(row => ({
          sections: row.map(col => ({
            field_path_pattern: col[0].fieldPathPattern
          })),
          settings: {}
        })),
        settings: {}
      },
      link_field: context !== 'fieldSet' ? linkField : '',
      list: listViewFields.map(item => ({
        field_path_pattern: item.fieldPathPattern,
        settings: {}
      }))
    }
    if (context === 'fieldSet') {
      delete resObj.link_field
    }
    const saveFunction = context === 'fieldSet' ? CollectionTypesService.saveFieldSetConfiguration : CollectionTypesService.saveCollectionConfiguration
    saveFunction(accID, subscriptionId, subscriberId, collectionId, resObj)
      .then(res => {
        tostAlert(<FormattedMessage {...messages.successfullySaved} />, 'success')
        const currentPath = location.pathname
        const targetPath = currentPath.replace(/(\/collection-types).*/, '$1')
        if (context === 'fieldSet') {
          fetchFieldSets()
          navigate(targetPath, {
            state: { preSelect: 'fieldSet' }
          })
        } else {
          fetchCollectionTypes()
          navigate(targetPath)
        }
      })
      .catch(err => {
        console.log('Error occured while saving collection type', err)
        apiErrorHandler(err)
      })
      .finally(() => {
        SetLoading(false)
        topbar.hide()
      })
  }

  return (
    <Box sx={classes.mainContainer}>
      <Box sx={classes.cardContainer}>

        <Box sx={classes.breadButtonsBox}>
          <Button
            disableElevation
            variant='outlined'
            size="small"
            sx={classes.cancelBtn}
            onClick={cancelBtnHandler}
          >
            <FormattedMessage {...messages.cancel} />
          </Button>
          <Button
            disableElevation
            variant='contained'
            size='small'
            sx={classes.uploadBtn}
            onClick={saveConfiguration}
          >
            <FormattedMessage {...messages.publish} />
          </Button>
        </Box>

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
          <Modal
            open={openAddFieldModal}
            onClose={handleCloseFieldModal}
            aria-labelledby="simple-modal-title-conf-collType"
            aria-describedby="simple-modal-description-conf-collType"
          >
            <AddFieldToListView
              listViewFieldsIds={listViewFieldsIds}
              editViewFieldsIds={editViewFieldsIds}
              fieldList={fieldList}
              addToListView={addToListView}
              addFieldToSection={addFieldToSection}
              isForListView={modalMetaData == null}
              modalMetaData={modalMetaData}
              handleClose={handleCloseFieldModal}
            />
          </Modal>
          <Box display="flex" pt={5} justifyContent="center">
            <Box display="flex" flexDirection="column" justifyContent="center" width="85%" maxWidth="960px">
              {
                context !== 'fieldSet'
                  ?
                  <Box>
                    <Paper sx={classes.paper} elevation={0}>
                      <Box display="flex" flexDirection="column">
                        <Box display="flex" width="100%" height="60px" justifyContent="space-between" alignItems="center" paddingX="25px">
                          <Typography sx={classes.addObjectiveHeading}><FormattedMessage {...messages.listView} /></Typography>
                          <AddBox onClick={handleOpenFieldModal} color="secondary" />
                        </Box>
                        <DragDropContext onDragEnd={onDragEndList}>
                          <Droppable droppableId="droppable" direction="horizontal">
                            {
                              (provided, snapshot) => (
                                <Box
                                  ref={provided.innerRef}
                                  sx={classes.greyBox}
                                >
                                  {
                                    listViewFields.map((item, index) =>
                                      <Draggable key={item.id} draggableId={item.id} index={index}>
                                        {
                                          (provided, snapshot) => (
                                            <Box
                                              sx={classes.moveableBox}
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                            >
                                              <DragIndicator sx={classes.moveableBoxMoverIcon} />
                                              <Box width="100%"><Typography noWrap sx={classes.moveableBoxText}>{item.localized_texts && item.localized_texts.en ? item.localized_texts.en : item.fieldName}</Typography></Box>
                                              <Box display="flex">
                                                {item.linkThisField ? <LinkOutlined color='primary' sx={classes.moveableBoxIcon} /> : ''}
                                                <DeleteOutline color='secondary' sx={classes.moveableBoxIcon} onClick={removeListField.bind(this, index)} />
                                              </Box>
                                            </Box>
                                          )
                                        }
                                      </Draggable>
                                    )
                                  }
                                </Box>
                              )
                            }
                          </Droppable>
                        </DragDropContext>
                      </Box>
                    </Paper>
                    <Box display="flex" alignItems="center" marginBottom="25px" marginLeft="15px">
                      <LinkOutlined color='primary' />
                      <Box width="150px" marginX="15px">
                        <TextField
                          name="linkField"
                          id="linkField"
                          variant='filled'
                          label={<FormattedMessage {...messages.linkField} />}
                          fullWidth
                          margin="normal"
                          select
                          size="small"
                          onChange={handleLinkFieldChange}
                          value={linkField}
                        >
                          {
                            listViewFields && listViewFields.length > 0
                              ?
                              listViewFields.map(item => <MenuItem value={item.fieldPathPattern}>{item.fieldName}</MenuItem>)
                              :
                              <MenuItem key="item_not_found" value="" disabled><FormattedMessage {...messages.addListViewToContinue} /></MenuItem>
                          }
                        </TextField>
                      </Box>
                    </Box>
                  </Box>
                  :
                  ''
              }
              <Paper sx={classes.paper} elevation={0}>
                <Box display="flex" flexDirection="column">
                  <Menu
                    id="edit-view-select-menu"
                    keepMounted
                    anchorEl={anchorEditViewMenu}
                    open={Boolean(anchorEditViewMenu)}
                    onClose={handleCloseEditMenu}
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
                    <Box sx={classes.greyBoxMenuContainer}>
                      <Box sx={classes.editSubMenu} onClick={addEditSection.bind(this, 1)}>
                        <Box sx={classes.greyBoxMenu}></Box>
                      </Box>
                      <Box sx={classes.editSubMenu} onClick={addEditSection.bind(this, 2)}>
                        <Box sx={classes.greyBoxMenu}></Box>
                        <Box sx={classes.greyBoxMenu}></Box>
                      </Box>
                    </Box>
                  </Menu>
                  <Box display="flex" width="100%" height="60px" justifyContent="space-between" alignItems="center" paddingX="25px">
                    <Typography sx={classes.addObjectiveHeading}><FormattedMessage {...messages.editView} /></Typography>
                    <PlaylistAddOutlined onClick={handleOpenEditMenu} color="secondary" />
                  </Box>
                  <DragDropContext onDragEnd={onDragEndEditParent}>
                    <Droppable droppableId="droppable2" direction="vertical">
                      {
                        (providedParent, snapshotParent) => (
                          <Box ref={providedParent.innerRef} width="100%">
                            {
                              editViewFields.map((row, rowIndex) =>
                                <Draggable key={"row_" + rowIndex} draggableId={"row_" + rowIndex} index={rowIndex}>
                                  {
                                    (provided, snapshot) => (
                                      <Box
                                        display="flex"
                                        width="100%"
                                        key={"editViewFields_outer_key_" + rowIndex}
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <DragDropContext onDragEnd={onDragEndEdit.bind(this, rowIndex)}>
                                          <Droppable droppableId="droppable3" direction="horizontal">
                                            {
                                              (providedChild, snapshotChild) => (
                                                <Box display="flex" width="100%" ref={providedChild.innerRef}>
                                                  {
                                                    row.map((col, colIndex) =>
                                                      <Box sx={classes.greyBoxEditMenu} key={"editViewFields_row_key_" + colIndex}>
                                                        <Box
                                                          display="flex"
                                                          width="100%"
                                                          justifyContent="space-between"
                                                          alignItems="center"
                                                        >
                                                          <Box display="flex">
                                                            {
                                                              col.map((item, index) =>
                                                                <Draggable key={"row_" + rowIndex + "_col_" + colIndex} draggableId={"row_" + rowIndex + "_col_" + colIndex} index={colIndex}>
                                                                  {
                                                                    (providedChildDrag, snapshotChildDrag) => (
                                                                      <Box
                                                                        sx={classes.moveableBox}
                                                                        key={"editViewFields_inner_key_" + colIndex}
                                                                        ref={providedChildDrag.innerRef}
                                                                        {...providedChildDrag.draggableProps}
                                                                        {...providedChildDrag.dragHandleProps}
                                                                      >
                                                                        <DragIndicator sx={classes.moveableBoxMoverIcon} />
                                                                        <Box width="100%"><Typography noWrap sx={classes.moveableBoxText}>{item.localized_texts && item.localized_texts.en ? item.localized_texts.en : item.fieldName}</Typography></Box>
                                                                        <DeleteOutline color='secondary' sx={classes.moveableBoxIcon} onClick={removeEditField.bind(this, rowIndex, colIndex, index)} />
                                                                      </Box>
                                                                    )
                                                                  }
                                                                </Draggable>
                                                              )
                                                            }
                                                          </Box>
                                                          <Box display="flex">
                                                            {
                                                              col.length < 1 ? <AddBox color='secondary' sx={classes.moreIcon} onClick={handleAddEditFieldClick.bind(this, rowIndex, colIndex, row.length)} /> : ''
                                                            }
                                                            <DeleteOutline color='secondary' sx={classes.moreIcon} onClick={removeSection.bind(this, rowIndex, colIndex)} />
                                                          </Box>
                                                        </Box>
                                                      </Box>

                                                    )
                                                  }
                                                </Box>
                                              )
                                            }
                                          </Droppable>
                                        </DragDropContext>
                                      </Box>
                                    )
                                  }
                                </Draggable>
                              )
                            }
                          </Box>
                        )
                      }
                    </Droppable>
                  </DragDropContext>
                </Box>
              </Paper>
            </Box>
          </Box >
        </LoadingOverlay >

      </Box>
    </Box >
  );
}

CollectionTypeConfView.propTypes = {
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

export default compose(withConnect)(CollectionTypeConfView);
