import { FILE_TYPE_IMAGE, FILE_TYPE_VIDEO, FILE_TYPE_DOCUMENT } from '../../../utils/constants';
import getCroppedImg from '../../../components/ImageCropperEnhanced/cropImage';
import axios from 'axios';
import { AxiosObjCollection } from '../../Configurations/axios-setup';

export const getFileType = (file) => {
  const fileExt = file.name.split('.')[1].toLowerCase()
  switch (fileExt) {
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'gif':
    case 'tif':
    case 'tiff':
    case 'bmp':
    case 'webp':
    case 'svg':
      return FILE_TYPE_IMAGE
    case 'mp4':
    case 'mpeg':
    case 'avi':
    case 'mkv':
    case 'mov':
    case 'wmv':
      return FILE_TYPE_VIDEO
    case 'pdf':
    case 'doc':
    case 'docx':
    case 'xls':
    case 'xlsx':
    case 'ppt':
    case 'pptx':
    case 'txt':
    case 'pptx':
    case 'pptx':
    case 'pptx':
    case 'ritf':
      return FILE_TYPE_DOCUMENT
    default:
      return 'Other'
  }
}

export const getOriginalDimensions = (inputFile, callBackSetFnc) => {
  const file = inputFile;
  const img = new Image();

  img.onload = function () {
    const sizes = {
      width: this.width,
      height: this.height
    };
    URL.revokeObjectURL(this.src);
    callBackSetFnc({ ...sizes })
  }

  const objectURL = URL.createObjectURL(file);
  img.src = objectURL;
}

export const getImageThumbnail = async (imgObj, selectedImageDimensions, callbackFnc) => {
  const croppedHeight = 250
  const croppedWidth = (croppedHeight * selectedImageDimensions.width) / selectedImageDimensions.height
  const croppedImagetmp = await getCroppedImg(
    imgObj,
    null,
    0,
    croppedHeight,
    croppedWidth,
    callbackFnc
  )
}

export const getVideoCover = (file, seekTo = 0.0) => {
  return new Promise((resolve, reject) => {
    // load the file to a video player
    const videoPlayer = document.createElement('video');
    videoPlayer.setAttribute('src', URL.createObjectURL(file));
    videoPlayer.load();
    videoPlayer.addEventListener('error', (ex) => {
      reject("error when loading video file", ex);
    });
    // load metadata of the video to get video duration and dimensions
    videoPlayer.addEventListener('loadedmetadata', () => {
      // seek to user defined timestamp (in seconds) if possible
      if (videoPlayer.duration < seekTo) {
        reject("video is too short.");
        return;
      }
      // delay seeking or else 'seeked' event won't fire on Safari
      setTimeout(() => {
        videoPlayer.currentTime = seekTo;
      }, 200);
      // extract video thumbnail once seeking is complete
      videoPlayer.addEventListener('seeked', () => {
        // define a canvas to have the same dimension as the video
        const canvas = document.createElement("canvas");
        canvas.height = 250;
        canvas.width = (250 * videoPlayer.videoWidth) / videoPlayer.videoHeight;
        // draw the video frame to canvas
        const ctx = canvas.getContext("2d");
        ctx.drawImage(videoPlayer, 0, 0, canvas.width, canvas.height);
        // return the canvas image as a blob
        ctx.canvas.toBlob(
          blob => {
            resolve(blob);
          },
          "image/jpeg",
          0.75 /* quality */
        );
      });
    });
  });
}

export const getThumbnailUrlForFile = async (accID, fileId, thumbnailName) => {
  if (fileId) {
    const fileObjRes = await getFileObject(accID, fileId)
    const FILE_CONTEXT = process.env.FILE_CONTEXT || 'impilos'
    const file = fileObjRes.data.advanced
    const fileDownloadObj = await getAzureUrlForFile(FILE_CONTEXT, file.container_name, file.blob_name)
    const url = fileDownloadObj.data.download_url
    return url
  }
}


export const getAzureUrlForFile = (fileContext, conatinerName, fileName) => {
  return AxiosObjCollection.get(`/api/storage/${fileContext}/blob/download/${conatinerName}?blob_name=${fileName}`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}


export const handleSelectedFileDownload = async (accID, fileIdArr, fileEntiryArr) => {
  fileEntiryArr.forEach(async file => {
    console.log("file: ", file)
    const FILE_CONTEXT = process.env.FILE_CONTEXT || 'impilos'
    const res = await getAzureUrlForFile(FILE_CONTEXT, file.bucket_name, file.object_key)
    console.log("res: ", res)
    window.open(res.data.download_url, "_blank")
  });
}

// export const handleFileOpenNewWindow = async (fileId) => {
//   const fileUrl = await getFileUrl(fileId)
//   window.open(fileUrl, "_blank")
// }

export const downloadFile = (url) => {
  return axios
    .get(url, {
      responseType: 'blob',

    })
}
export const getFileObject = (accID, fileId) => {
  return AxiosObjCollection.get(`/api/media/${accID}/subscriber/${accID}/subscription/${accID}/file/${fileId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}

// export const getFileUrl = async (fileId) => {
//   if (fileId) {
//     const parsedDPODToken = DpodAuthServices.getParsedDpodToken()
//     const accID = parsedDPODToken.root_account_id
//     const subscriberId = parsedDPODToken.subscriber_id
//     const subscriptionId = parsedDPODToken.subscription_id
//     const fileObjRes = await getFileObject(accID, fileId)
//     const FILE_CONTEXT = process.env.FILE_CONTEXT || 'impilos'
//     const file = fileObjRes.data.advanced
//     const fileDownloadObj = await getAzureUrlForFile(FILE_CONTEXT, file.container_name, file.blob_name)
//     const url = fileDownloadObj.data.download_url
//     return url
//   }
// }

export const handleFileOpen = async (accID, fileId, type, file) => {
  const FILE_CONTEXT = process.env.FILE_CONTEXT || 'impilos'
  const resData = await getAzureUrlForFile(FILE_CONTEXT, file.bucket_name, file.object_key)
  if (!resData.data) {
    return
  }
  const commonFileExtensions = ["pdf"];
  const commonImageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const commonVideoExtensions = ["mp4", "mpeg", "avi", "mkv", "mov", "wmv"];
  let fileURL = resData.data.download_url
  // Download the file contents
  const res = await downloadFile(fileURL)
  if (commonFileExtensions.includes(type)) {
    const blob = new Blob([res.data], { type: `application/${type}` })
    fileURL = URL.createObjectURL(blob)
  }
  else if (commonImageExtensions.includes(type)) {
    const blob = new Blob([res.data], { type: `image/${type}` })
    fileURL = URL.createObjectURL(blob)
  }
  else if (commonVideoExtensions.includes(type)) {
    const blob = new Blob([res.data], { type: `video/${type}` })
    fileURL = URL.createObjectURL(blob)
  }
  window.open(fileURL, "_blank")
}

