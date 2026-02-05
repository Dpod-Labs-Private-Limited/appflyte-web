import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Button, Divider } from '@mui/material';
import { FormattedMessage } from 'react-intl';
import styles from './styles';
import messages from './messages';

const CollectionDeleteWarning = forwardRef((props, ref) => {
  const {
    successNames = [],
    warningNames = {},
    errorNames = [],
    successMsg,
    warningMsg,
    errorMsg,
    handleClose,
    context = 'collection',
  } = props;

  const classes = styles;

  const handleResolve = (redirectPath) => {
    if (redirectPath === '__HANDLE_CLOSE__') {
      handleClose();
      return;
    }
    const finalPath = `${process.env.COACH_WEB_APP_URL}${redirectPath}`;
    window.open(finalPath, '_blank');
  };

  const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    ...classes.modal,
  };

  const getCustomWarningMessage = (code) => {
    switch (code) {
      case 'CLER34':
        return <Typography sx={classes.errorFont}><FormattedMessage {...messages.relationDefined} /></Typography>;
      case 'CLER35':
        return <Typography sx={classes.errorFont}><FormattedMessage {...messages.theseItemsWarning} /></Typography>;
      case 'CLER36':
        return <Typography sx={classes.errorFont}><FormattedMessage {...messages.innerFieldSetItems} /></Typography>;
      case 'CLER37':
        return <Typography sx={classes.errorFont}><FormattedMessage {...messages.removeRefeFieldSet} /></Typography>;
      case 'CLER38':
        return <Typography sx={classes.errorFont}><FormattedMessage {...messages.removeRefeFieldSetColl} /></Typography>;
      default:
        return <Typography sx={classes.errorFont}><FormattedMessage {...messages.resolveTheIssue} /></Typography>;
    }
  };

  return (
    <Box ref={ref} sx={modalStyle}>
      <Box sx={classes.titleBar}>
        <Typography sx={classes.title}>
          {context === 'collection' ? (
            <FormattedMessage {...messages.titleCollection} />
          ) : (
            <FormattedMessage {...messages.titleFieldSet} />
          )}
        </Typography>
        <Button
          disableElevation
          size="small"
          variant="contained"
          sx={classes.cancelBtnOverwrite}
          onClick={handleClose}
        >
          <FormattedMessage {...messages.cancelBtn} />
        </Button>
      </Box>
      <Divider sx={{ width: '100%' }} />
      <Box display="flex" flexDirection="column" overflow="auto" px={2}>
        {Object.keys(warningNames).map((warningCode) => (
          <Box key={warningCode} display="flex" flexDirection="column" width="100%" my={1.5}>
            {getCustomWarningMessage(warningCode)}
            <Box display="flex" width="100%" mt={2} mb={1.5}>
              <Box width="250px">
                <Typography sx={classes.nameHeader}>
                  {context === 'collection' ? (
                    <FormattedMessage {...messages.collectionType} />
                  ) : (
                    <FormattedMessage {...messages.fieldSet} />
                  )}
                </Typography>
              </Box>
              <Box width="100%">
                {warningCode !== 'CLER35' && warningCode !== 'CLER36' && (
                  <Typography sx={classes.nameHeader}>
                    {warningCode !== 'CLER37' ? (
                      <FormattedMessage {...messages.depFieldSet} />
                    ) : (
                      <FormattedMessage {...messages.depCollectionType} />
                    )}
                  </Typography>
                )}
              </Box>
            </Box>
            {warningNames[warningCode].map((item) => (
              <Box key={item.collectionName} display="flex" width="100%" mb={1.5}>
                <Box width="250px">
                  <Typography sx={classes.itemFont}>{item.collectionName}</Typography>
                </Box>
                <Box display="flex" flexDirection="column" width="100%">
                  {item.redirectPath.map((x) => (
                    <Box key={x.path} display="flex" width="100%" justifyContent="space-between">
                      <Typography sx={classes.itemFont}>{x.name || ''}</Typography>
                      <Typography
                        onClick={() => handleResolve(x.path)}
                        sx={classes.resolveLink}
                      >
                        <FormattedMessage {...messages.resolveNow} />
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        ))}
        {errorNames.length > 0 && (
          <Box display="flex" flexDirection="column" width="100%" my={1.5}>
            <Typography sx={classes.errorFont}>
              <FormattedMessage {...messages.theseItemsError} />
            </Typography>
            <Box display="flex" width="100%" mt={2} mb={1.5}>
              <Box width="250px">
                <Typography sx={classes.nameHeader}>
                  {context === 'collection' ? (
                    <FormattedMessage {...messages.collectionType} />
                  ) : (
                    <FormattedMessage {...messages.fieldSet} />
                  )}
                </Typography>
              </Box>
              <Box width="100%" />
            </Box>
            {errorNames.map((errorItem) => (
              <Box key={errorItem} display="flex" width="100%" mb={1.5}>
                <Box width="250px">
                  <Typography sx={classes.itemFont}>{errorItem}</Typography>
                </Box>
              </Box>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
});

CollectionDeleteWarning.propTypes = {
  successNames: PropTypes.array,
  warningNames: PropTypes.object,
  errorNames: PropTypes.array,
  successMsg: PropTypes.node,
  warningMsg: PropTypes.node,
  errorMsg: PropTypes.node,
  handleClose: PropTypes.func.isRequired,
  context: PropTypes.string,
};

export default CollectionDeleteWarning;
