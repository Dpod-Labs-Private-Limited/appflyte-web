/**
 *
 * CollectionsLayout
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';
import { Box, Typography, Button } from '@mui/material';
import styles from './styles'
import DrawerListCollection from '../../../components/DrawerListCollection';
import CollectionListing from '../CollectionListing';
import CollectionAdd from '../CollectionAdd';
import CollectionTypesService from '../../../Api/Services/collection/collectionTypesService';

import messages from './messages';
import topbar from 'topbar';
import LoadingOverlay from 'react-loading-overlay';
import { useOutletContext } from 'react-router-dom';
import Chatbot from '../../../components/Chatbot';

export function CollectionsLayout() {

  const { setOpen, open, tostAlert, selectedUser, location,
    navigate, centralLoadingFlags, collectionPublishedList } = useOutletContext();

  const classes = styles;

  const [selectedTab, setSelectedTab] = useState()
  const [selectedCollection, setSelectedCollection] = useState()
  const [listOrAdd, setListOrAdd] = useState('list')
  const [loading, SetLoading] = useState(false)
  const [editObj, setEditObj] = useState()
  const [otherItemsList, setOtherItemsList] = useState([])

  const [languageList, setLanguageList] = useState([{
    "name": "English",
    "value": "en"
  },])
  const [languageMasterList, setLanguageMasterList] = useState()

  useEffect(() => {
    setOpen(false)
    return () => {
      setOpen(true)
    }
  }, [])

  useEffect(() => {
    if (centralLoadingFlags) {
      if (centralLoadingFlags.publishedCollection === true) {
        topbar.show()
        SetLoading(true)
      }
      else {
        topbar.hide()
        SetLoading(false)
      }
    }
  }, [centralLoadingFlags])

  useEffect(() => {
    topbar.show()
    SetLoading(true)
    CollectionTypesService
      .getSupportedLanguages()
      .then(res => {
        setLanguageMasterList(res.data)
      })
      .catch(err => {
        console.log("Error occured while fetching supportedFieldTypes", err)
      })
      .finally(() => {
        SetLoading(false)
        topbar.hide()
      })
  }, [selectedUser])

  useEffect(() => {
    if (selectedCollection && languageMasterList) {
      const langSet = new Set()
      selectedCollection.fields_list.forEach(field => {
        Object.keys(field.localized_texts).forEach(lang => {
          langSet.add(lang)
        })
      })
      const filteredLanguageList = languageMasterList.filter(x => langSet.has(x.value))
      setLanguageList(filteredLanguageList)
    }
  }, [selectedCollection, languageMasterList])

  useEffect(() => {
    if (collectionPublishedList && collectionPublishedList.length && collectionPublishedList.length > 0) {
      const currPath = location.pathname.split('/')
      let defIndex = 0
      if (currPath.length > 2 && currPath[currPath.length - 2] === "collections") {
        const slug = currPath[currPath.length - 1]
        const serIndex = collectionPublishedList.findIndex(x => x.api_singular_id === slug)
        if (serIndex > -1)
          defIndex = serIndex
      }
      setSelectedCollection(collectionPublishedList[defIndex])
      setSelectedTab(collectionPublishedList[defIndex].api_singular_id)
    }
  }, [collectionPublishedList])

  return (

    <Box sx={classes.mainContainer}>
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

        <Chatbot />

        <Box sx={styles.sidebar}>
          <Box sx={classes.drawerContentBox}>
            <DrawerListCollection
              collectionPublishedList={collectionPublishedList}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
              setListOrAdd={setListOrAdd}
              setSelectedCollection={setSelectedCollection}
              showLimited={false}
              navigate={navigate}
            // showLimited={location.clientObj && "last_login" in location.clientObj}
            />
          </Box>
        </Box>

        <main style={styles.componentContainer}>
          <Box sx={styles.cardContainer}>

            <Box
              // sx={
              //   open
              //     ?
              //     (listOrAdd === 'list' ? classes.breadButtonsBox : classes.breadButtonsBoxAdd)
              //     :
              //     (listOrAdd === 'list' ? classes.breadButtonsBoxClosed : classes.breadButtonsBoxClosedAdd)
              // }

              display="flex" alignItems="center" justifyContent="space-between"

            >

              <Box display="flex">
                {
                  selectedCollection && <Typography sx={classes.breadCrumbBold} onClick={() => { setListOrAdd('list') }}>
                    {selectedCollection.entity_name}
                  </Typography>
                }
                &nbsp;&nbsp;
                {
                  selectedCollection && <Typography sx={classes.breadCrumbNormal}>
                    {listOrAdd === 'add' ? (editObj ? ' >  Modify Item' : ' >  New Item') : ''}
                  </Typography>
                }
              </Box>
              {
                selectedCollection
                  ?
                  <Box>
                    {
                      listOrAdd === 'list'
                        ?
                        <Button
                          disableElevation
                          size="small"
                          variant="contained"
                          sx={classes.saveDraftBtn}
                          onClick={() => {
                            setListOrAdd('add')
                          }}>
                          <FormattedMessage {...messages.addItem} />
                        </Button>
                        :
                        <Box display="flex">
                          <Button
                            disableElevation
                            variant='outlined'
                            size="small"
                            sx={classes.cancelBtn}
                            onClick={() => { setListOrAdd('list') }}
                          >
                            <FormattedMessage {...messages.cancel} />
                          </Button>
                        </Box>
                    }
                  </Box>
                  :
                  ''
              }
            </Box>

            <Box display="flex" width="100%" justifyContent="center">
              {
                listOrAdd === 'list'
                  ?
                  <CollectionListing
                    languageList={languageList}
                    selectedCollection={selectedCollection}
                    selectedTab={selectedTab}
                    selectedUser={selectedUser}
                    tostAlert={tostAlert}
                    setEditObj={setEditObj}
                    setListOrAdd={setListOrAdd}
                    setOtherItemsList={setOtherItemsList}
                  />
                  :
                  <CollectionAdd
                    languageList={languageList}
                    selectedTab={selectedTab}
                    selectedUser={selectedUser}
                    selectedCollection={selectedCollection}
                    setListOrAdd={setListOrAdd}
                    tostAlert={tostAlert}
                    editObj={editObj}
                    otherItemsList={otherItemsList}
                  />
              }

            </Box>

          </Box>
        </main>


      </LoadingOverlay>
    </Box>
  );

}

CollectionsLayout.propTypes = {
  dispatch: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
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

export default compose(withConnect)(CollectionsLayout);
