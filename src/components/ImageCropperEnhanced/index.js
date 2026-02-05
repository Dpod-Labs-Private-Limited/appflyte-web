
/**
 *
 * ImageCropperEnhanced
 *
 */


// import PropTypes from 'prop-types';
// import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import messages from './messages';
import React, { useState, useCallback, useEffect } from 'react'
import ReactDOM from 'react-dom'
import Cropper from 'react-easy-crop'
import Slider from '@material-ui/core/Slider'
import { Box, FormLabel, Typography, Divider, Button, FormGroup, FormControlLabel, Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles'
import ImgDialog from './imgDialog'
import getCroppedImg from './cropImage'
import { styles } from './styles';
import { useMediaQuery } from 'react-responsive';

const minZoom = 0.4

const ImageCropper2 = (props) => {

  const modalStyle = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };

  const modalStyleMobile = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%'
  };

  const isMobile = useMediaQuery({ maxWidth: 767 });
  const isDesktop = useMediaQuery({ minWidth: 768 });

  const { classes } = props;

  const [img, setImg] = useState()
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [croppedImage, setCroppedImage] = useState(null)
  const [selectedImageDimensions, setSelectedImageDimensions] = useState({
    height: 512,
    width: 512
  })

  const getOriginalDimensions = (inputFile) => {
    const file = inputFile;
    const img = new Image();

    img.onload = function () {
      const sizes = {
        width: this.width,
        height: this.height
      };
      URL.revokeObjectURL(this.src);
      setSelectedImageDimensions({ ...sizes })
    }

    const objectURL = URL.createObjectURL(file);
    img.src = objectURL;
  }

  const getDimensionForMode = (mode) => {
    switch (mode) {
      case 'logo':
        return ({
          height: 100,
          width: 300
        })
      case 'profile':
        return ({
          height: selectedImageDimensions.height,
          width: selectedImageDimensions.height * getAspectRatioForMode(mode)
        })
      case 'favicon':
        return ({
          height: 48,
          width: 48
        })
      case 'program_image':
        return ({
          height: selectedImageDimensions.height,
          width: selectedImageDimensions.height * getAspectRatioForMode(mode)
        })
      case 'playlist_image':
        return ({
          height: selectedImageDimensions.height,
          width: selectedImageDimensions.height * getAspectRatioForMode(mode)
        })
      case 'logoOnboarding':
        return ({
          height: selectedImageDimensions.height,
          width: selectedImageDimensions.height * getAspectRatioForMode(mode)
        })
    }
  }

  const getAspectRatioForMode = (mode) => {
    switch (mode) {
      case 'logo':
        return (3 / 1)
      case 'profile':
      case 'favicon':
      case 'logoOnboarding':
      case 'playlist_image':
        return (1 / 1)
      case 'program_image':
        return (1.91 / 1)
    }
  }

  useEffect(() => {
    if (props.image) {
      const reader = new FileReader();
      reader.addEventListener("load", () => setImg(reader.result));
      reader.readAsDataURL(props.image);
      getOriginalDimensions(props.image)
    }
  }, [])

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const showCroppedImage = useCallback(async () => {
    try {
      const finalHeight = getDimensionForMode(props.mode).height
      const finalWidth = getDimensionForMode(props.mode).width
      const croppedImagetmp = await getCroppedImg(
        img,
        croppedAreaPixels,
        rotation,
        finalHeight,
        finalWidth,
        (blob) => {
          props.imageUploadHandler(blob, 'cropped')
          if (props.mode === 'profile')
            props.imageUploadHandler(props.image, 'normal')
          props.handleClose()
        }
      )
      setCroppedImage(croppedImagetmp)
    } catch (e) {
      console.error(e)
    }
  }, [croppedAreaPixels, rotation])

  const onClose = useCallback(() => {
    setCroppedImage(null)
  }, [])

  return (
    <div style={isMobile ? modalStyleMobile : modalStyle} sx={classes.modal} >
      <Box flex={1} width="100%">
        <Box px="20px" py="15px" display="flex" width="100%" justifyContent="space-between">
          <Box>
          </Box>
          <Box display="flex" flexDirection="row" alignItems="center">
            <Button disableElevation size="small" variant="contained" sx={classes.cancelBtn} onClick={() => {
              props.handleClose();
            }}>
              <FormattedMessage {...messages.cancelBtn} />
            </Button>
            <Button disableElevation type="button" size="small" variant="contained" color="secondary" sx={classes.saveBtn} onClick={showCroppedImage}>
              <FormattedMessage {...messages.saveBtn} />
            </Button>
          </Box>
        </Box>
        <Divider width="100%" />
        <Box display="flex" flexDirection="column" width="100%">
          <Box sx={classes.cropContainer}>
            <Cropper
              image={img}
              crop={crop}
              // rotation={rotation}
              zoom={zoom}
              aspect={getAspectRatioForMode(props.mode)}
              restrictPosition={false}
              onCropChange={setCrop}
              // onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
            />
          </Box>
          <Box paddingX="20px" width="100%">
            <Slider
              value={zoom}
              min={minZoom}
              max={3}
              step={0.05}
              aria-labelledby="Zoom"
              classes={{ container: classes.slider }}
              onChange={(e, zoom) => setZoom(zoom)}
            />
          </Box>
        </Box>
      </Box>
    </div>
  )


}

const ImageCropperEnhanced = withStyles(styles)(ImageCropper2)

ImageCropperEnhanced.propTypes = {};

export default ImageCropperEnhanced;
