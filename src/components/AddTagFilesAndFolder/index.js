import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Chip, LinearProgress, Autocomplete, TextField } from '@mui/material'; // MUI v5 imports
import { createFilterOptions } from '@mui/material/Autocomplete';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { COLLECTION_ENTITY, FILES_TAG_NAME_DEFAULT } from '../../utils/constants';
import { v4 as uuidv4 } from 'uuid';
import CollectionsService from '../../Api/Services/collection/collectionsService';

function AddTagFilesAndFolder(props) {
  const filter = createFilterOptions();

  const [selectedTags, setSelectedTags] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [loading, setLoading] = useState(false);

  const apiErrorHandler = (err) => {
    if (err.response !== undefined && err.response !== null) {
      if (err.response.data === null)
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error');
      else if ('schema_errors' in err.response.data)
        props.tostAlert(<FormattedMessage {...messages.invalidInput} />, 'error');
      else if ('message' in err.response.data)
        props.tostAlert(err.response.data.message, 'error');
      else
        props.tostAlert(<FormattedMessage {...messages.someErrOccrd} />, 'error');
    } else {
      if (err.message === 'Network Error')
        props.tostAlert(<FormattedMessage {...messages.serverError} />, 'error');
    }
  };

  const getExistingTagForEntity = () => {
    const entityId = props.selectedEntity.entityId;
    const subscriptionId = props.selectedUser.subscriptionId;
    const subscriberId = props.selectedUser.subscriberId;
    CollectionsService
      .getAllTagsForSubscription(subscriptionId, subscriberId, COLLECTION_ENTITY.files, entityId)
      .then((res) => {
        const tmpArr = res.data.map((item) => ({
          tagName: item.tag_name,
          tagNameId: item.tag_name_id,
          tagValue: item.tag_value,
          tagValueId: item.tag_value_id,
        }));
        setSelectedTags(tmpArr);
      })
      .catch((err) => {
        console.log('error while fetching existing tags', err);
        setSelectedTags([]);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getCollectionTags = () => {
    const subscriberId = props.selectedUser.subscriber_id;
    const subscriptionId = props.selectedUser.subscription_id;
    CollectionsService
      .getCollectionsForEntity(subscriptionId, subscriberId, COLLECTION_ENTITY.files)
      .then((res) => {
        const allTagValues = [];
        res.data.forEach((name) => {
          name.values.forEach((value) => {
            allTagValues.push({
              tagName: name.name,
              tagNameId: name.id,
              tagValue: value.name,
              tagValueId: value.id,
            });
          });
        });
        setTagList(allTagValues);
      })
      .catch((err) => {
        console.log('error in catch block of getCollection of fileTag', err);
      });
  };

  useEffect(() => {
    if (props.selectedUser) {
      setLoading(true);
      getCollectionTags();
      getExistingTagForEntity();
    }
  }, [props.selectedUser]);

  const handleAutoSuggest = (event, value) => {
    if (value == null) {
      return false;
    }
    let arr = selectedTags;
    if (value.tagValueId) arr.push(value);
    else
      arr.push({
        tagName: FILES_TAG_NAME_DEFAULT,
        tagNameId: null,
        tagValue: value.inputValue,
        tagValueId: null,
      });
    setSelectedTags([...arr]);
  };

  const handleTagDelete = (index) => {
    let tempArr = [...selectedTags];
    tempArr.splice(index, 1);
    setSelectedTags(tempArr);
  };

  const handleSubmit = async () => {
    setLoading(true);
    const subscriberId = props.selectedUser.subscriber_id;
    const subscriptionId = props.selectedUser.subscription_id;
    const accountId = props.selectedUser.root_account_id;
    const entityId = props.selectedEntity.entityId;
    const newCollectionArr = [];
    const existingCollectionArr = [];
    let tagNameId;
    if (tagList.length > 0) {
      tagNameId = tagList[0].tagNameId;
    } else {
      tagNameId = uuidv4();
      newCollectionArr.push({
        id: tagNameId,
        is_assignable: false,
        parent_collection_id: null,
        name: FILES_TAG_NAME_DEFAULT,
        description: FILES_TAG_NAME_DEFAULT,
        domain_entity_type: COLLECTION_ENTITY.files,
        component_style_name: 'StaggeredGridView',
        properties: null,
      });
    }
    selectedTags.forEach((item) => {
      if (item.tagNameId == null) {
        const valId = uuidv4();
        newCollectionArr.push({
          id: valId,
          is_assignable: true,
          parent_collection_id: tagNameId,
          name: item.tagValue,
          description: item.tagValue,
          domain_entity_type: COLLECTION_ENTITY.files,
          component_style_name: 'StaggeredGridView',
          properties: null,
        });
        existingCollectionArr.push({
          tag_value: item.tagValue,
          tag_name: item.tagName,
          tag_name_id: tagNameId,
          tag_value_id: valId,
        });
      } else
        existingCollectionArr.push({
          tag_value: item.tagValue,
          tag_name: item.tagName,
          tag_name_id: item.tagNameId,
          tag_value_id: item.tagValueId,
        });
    });
    try {
      const res = await CollectionsService.createCollectionsForEntity(accountId, subscriptionId, subscriberId, newCollectionArr);
      const resObj = {
        entity_type: COLLECTION_ENTITY.files,
        entity_id: entityId,
        tags: existingCollectionArr,
      };
      const res2 = await CollectionsService.overwriteTags(accountId, subscriptionId, subscriberId, resObj);
    } catch (err) {
      console.log('error occured while saving tags', err);
      apiErrorHandler(err);
    } finally {
      setLoading(false);
      props.handleClose();
    }
  };

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
            onClick={() => props.handleClose()}
          >
            <FormattedMessage {...messages.cancelBtn} />
          </Button>
          <Button
            size="small"
            disableElevation
            variant="contained"
            color="secondary"
            sx={{ ml: 2 }}
            onClick={handleSubmit}
          >
            <FormattedMessage {...messages.saveBtn} />
          </Button>
        </Box>
      </Box>
      {loading && <LinearProgress sx={{ width: '100%' }} />}
      <Box>
        <Autocomplete
          id="tagList"
          options={tagList}
          name="tagList"
          size="small"
          filterOptions={(options, params) => {
            const filtered = filter(options, params);
            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                tagValue: `Add "${params.inputValue}"`,
              });
            }
            return filtered;
          }}
          selectOnFocus
          handleHomeEndKeys
          getOptionLabel={(option) => {
            if (typeof option === 'string') {
              return option;
            }
            if (option.inputValue) {
              return option.inputValue;
            }
            return option.tagValue;
          }}
          renderOption={(props, option) => (
            <Box component="li" {...props}>{option.tagValue}</Box>
          )}
          renderInput={(params) => (
            <TextField {...params} size="small" margin="normal" label="Search and Add" variant="filled" />
          )}
          onChange={handleAutoSuggest}
          freeSolo
        />
        <Box my="15px" display="flex" width="100%" flexWrap="wrap">
          {selectedTags.map((item, index) => (
            <Box p="5px" key={index}>
              <Chip
                label={item.tagValue}
                color="secondary"
                onDelete={() => handleTagDelete(index)}
              />
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}

AddTagFilesAndFolder.propTypes = {};

export default AddTagFilesAndFolder;
