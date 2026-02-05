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
function FileItem(props) {

  console.log("FileItem props: ", props)

  const { fileName, fileType, isFolder, file, selectedEntity, setSelectedEntity, selectedEntityDetails, setSelectedEntityDetails, handleDoubleClick, customMargin, selectionLimit, fileTypeLimit } = props

  const classes = styles;

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
        console.log("file: ", file);
        const FILE_CONTEXT = process.env.FILE_CONTEXT || 'impilos';
        try {
          const res = await getAzureUrlForFile(FILE_CONTEXT, file.bucket_name, file.object_key);
          console.log("Response from newGetThumbnailUrlForFile: ", res);
          if (res.status === 200) {
            setFileDownloadUrl(res.data.download_url);
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
