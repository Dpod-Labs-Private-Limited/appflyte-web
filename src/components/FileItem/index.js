/**
 *
 * FileItem
 *
 */

import React from 'react';
import { Box, Typography, Button, Tabs, Tab, CircularProgress, Drawer, CardMedia } from '@mui/material';
import styles from './styles'
import { FolderOutlined, DescriptionOutlined } from '@mui/icons-material';
import DEFAULT_IMG_COVER from '../../images/image_alt_image.png'
import { FILE_TYPE_IMAGE, FILE_TYPE_VIDEO, FILE_TYPE_DOCUMENT, FILE_TYPE_FOLDER } from '../../utils/constants';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import { useEffect, useState } from 'react';
import { getAzureUrlForFile } from '../../Api/Services/files/fileUtilityService';
import GalleryService from '../../Api/Services/files/galleryService';
import { useAppContext } from '../../context/AppContext';
function FileItem(props) {

  const { fileName, fileType, isFolder, file, selectedEntity, setSelectedEntity, selectedEntityDetails, setSelectedEntityDetails, handleDoubleClick, customMargin, selectionLimit, fileTypeLimit } = props

  const classes = styles;
  const { selectedProject } = useAppContext();

  const handleFileSelect = (e) => {
    e.stopPropagation();
    let tmp = [...selectedEntity]
    let tmp2 = [...selectedEntityDetails]
    const pos = tmp.indexOf(file.entityId)
    if (pos < 0) {
      if (selectionLimit && selectedEntity.length >= selectionLimit)
        return false
      if (fileTypeLimit && fileTypeLimit.length && fileTypeLimit.length > 0 && !fileTypeLimit.includes(file.entitySubType))
        return false
      tmp.push(file.entityId)
      tmp2.push(file)
    }
    else {
      tmp.splice(pos, 1)
      tmp2.splice(pos, 1)
    }
    setSelectedEntity([...tmp])
    setSelectedEntityDetails([...tmp2])
  }

  const [fileDownloadUrl, setFileDownloadUrl] = useState(null)

  useEffect(() => {

    const fetchFileDownloadUrl = async () => {
      if (file && file.entitySubType === 'Image') {
        try {
          const accID = props?.selectedUser?.root_account_id ?? null;
          const subscriberId = props?.selectedUser?.subscriber_id ?? null;
          const subscriptionId = props?.selectedUser?.subscription_id ?? null;
          const schemaId = selectedProject.payload.__auto_id__ ?? null;
          const bucket_name = file?.bucketName ?? null;
          const object_paths = file?.objectKey ?? null;

          const res = await GalleryService.getDownloadURL(accID, subscriberId, subscriptionId, schemaId, bucket_name, object_paths);
          if (res.status === 200) {
            const res_data = res?.data?.at(-1) ?? null;
            const file_url = Object.values(res_data)?.at(-1) ?? null;
            if (file_url) {
              setFileDownloadUrl(file_url)
            }
          }
        } catch (error) {
          console.error("Error fetching file download URL: ", error);
        }
      }
    };

    fetchFileDownloadUrl(); // Call the async function
  }, [file]);

  return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" margin={customMargin ?? "18px"} maxWidth="150px">
      <Box
        sx={selectedEntity && selectedEntity.includes(file.entityId) ? classes.rootBoxSelected : classes.rootBox}
        onClick={handleFileSelect}
        onDoubleClick={handleDoubleClick}
      >
        {
          {
            [FILE_TYPE_FOLDER]: <FolderOutlined sx={classes.fileTypeIcon} />,
            [FILE_TYPE_DOCUMENT]: <DescriptionOutlined sx={classes.fileTypeIcon} />,
            [FILE_TYPE_IMAGE]:
              <Box>
                {
                  fileName.split(".")[fileName.split(".").length - 1] === "svg"
                    ?
                    <CardMedia
                      component="img"
                      alt={fileName}
                      image={DEFAULT_IMG_COVER}
                      sx={classes.svgIconThumbnail}
                    />
                    :
                    fileDownloadUrl ?
                      <CardMedia
                        component="img"
                        alt={fileName}
                        image={fileDownloadUrl}
                        sx={classes.thumbnail}
                      />
                      : ''
                }
              </Box>,
            [FILE_TYPE_VIDEO]:
              <Box>
                <CardMedia
                  component="img"
                  alt={fileName}
                  image={file.entityThumbnail}
                  sx={classes.thumbnail}
                />
              </Box>,
          }[fileType]
        }
      </Box>
      <Typography noWrap={true} sx={classes.nameText}>{fileName}</Typography>
    </Box>
  );
}

FileItem.propTypes = {};

export default FileItem;
