/**
 *
 * ImageComponent
 *
 */
import React, { useState } from 'react';
import { Box,  CardMedia, CircularProgress } from '@mui/material';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import styles from './styles';
function ImageComponent(props) {

  const { hideDelete } = props

  const [isLoaded, setIsLoaded] = useState(false)

  const handleLoadDone = () => {
    setIsLoaded(true)
  }
  const classes = styles;
  return (
    <Box display="flex">
      {
        isLoaded
          ?
          (
            hideDelete == null || hideDelete === false
              ?
              <RemoveCircleIcon
                sx={props.isSmall ? classes.deleteIconPhoto : (props.isWide ? classes.deleteIconPhotoWide : classes.deleteIconPhoto)}
                color="secondary"
                onClick={
                  props.onRemove
                    ?
                    props.onRemove
                    :
                    () => {
                      let tmpArr = props.imagesForUpload
                      let tmpArr2 = props.imagesForPreview
                      tmpArr.splice(props.index, 1)
                      tmpArr2.splice(props.index, 1)
                      props.setImagesForUpload([...tmpArr])
                      props.setImagesForPreview([...tmpArr2])
                      if (props.includedImagesForUpload) {
                        let tmpArr3 = props.includedImagesForUpload
                        tmpArr3.splice(props.index, 1)
                        props.setIncludedImagesForUpload([...tmpArr3])
                      }
                      if (props.selectorID) {
                        document.getElementById(props.selectorID).value = null;
                      }
                    }} />
              :
              ''
          )
          :
          <CircularProgress sx={classes.deleteIconPhoto} />
      }
      <CardMedia
        sx={props.isSmall ? classes.photographImageSmall : (props.isWide ? classes.photographImageWide : classes.photographImage)}
        component="img"
        // alt={<CircularProgress />}
        image={props.image}
        // title="logo"
        onLoad={handleLoadDone}
        onClick={props.onSelect ?? undefined}
      />
    </Box>
  );
}

ImageComponent.propTypes = {};

export default ImageComponent;
