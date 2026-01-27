import moment from 'moment';
import FilesApi from '../Api/Services/AppflyteBackend/FileServiceApi';

const uploadFile = async (blob, reqBody) => {
  try {
    const response = await FilesApi.getPresignedURL(JSON.stringify(reqBody))
    if (response.status === 200) {

      const urlFields = JSON.parse(response.data.url_fields)
      let formData = new FormData();

      formData.append('key', urlFields.key);
      formData.append('AWSAccessKeyId', urlFields.AWSAccessKeyId);
      formData.append('x-amz-security-token', urlFields['x-amz-security-token']);
      formData.append('policy', urlFields.policy);
      formData.append('signature', urlFields.signature);
      formData.append('file', blob);

      const resUpload = await FilesApi.uploadFile(response.data.url, formData)
      if (resUpload.status === 200 || resUpload.status === 204) {
        return response?.data?.file_id
      } else {
        console.log('Error in uploading file')
        return null
      }

    } else {
      console.log('Error in getting pre-signed url')
      return null
    }
  } catch (e) {
    console.log('Err ' + e)
    return null
  }
}

const uploadAndAppendForPost = async (file, fileType, thumbnailFileId) => {
  try {

    const reqBodyFile = {
      filecontext: 'bucket_dpod_user_file',
      contentType: file?.name?.split('.')[1],
      filetype: '',
      fileName: file?.name
    }

    const uploadedFileId = await uploadFile(file, reqBodyFile)
    if (uploadedFileId) {
      const uploadedFileUrl = await FilesApi.getUploadedFileUrls(uploadedFileId)
      if (uploadedFileUrl.status === 200) {
        const tempJsonArr = [...resJsonVar]

        const uploadResObj = {
          access_type: filePermission,
          file_type: fileType,
          folder_id: null,
          file_id: uploadedFileId,
          thumbnail_file_id: thumbnailFileId,
          file_attributes: {
            file_name: file?.name,
            file_url: uploadedFileUrl?.data?.[0]?.url,
            created_on: moment().format("DD-MM-YYYY"),
            file_extension: file?.name?.split('.')[1]
          }
        }

        tempJsonArr.push(uploadResObj)
        resJsonVar = tempJsonArr
        setUploadJson(tempJsonArr)
        return { fileId: uploadedFileId, fileUrl: uploadedFileUrl?.data?.[0]?.url, tempJsonArr: tempJsonArr }
      } else {
        console.log('Error in getting uploaded file url')
        return { fileId: null, fileUrl: null, tempJsonArr: null }
      }
    } else {
      console.log('Error in uploading file')
      return { fileId: null, fileUrl: null, tempJsonArr: null }
    }
  }
  catch (err) {
    console.log("ERROR: ", err);
    return { fileId: null, fileUrl: null, tempJsonArr: null }
  }
}


export const handleDocumentUpload = async (file) => {
  try {
    const uploadResponse = await uploadAndAppendForPost(file, 'Document', null)
    if (uploadResponse.fileUrl && uploadResponse.fileId && uploadResponse.tempJsonArr) {
      return { fileUrl: uploadResponse.fileUrl, fileId: uploadResponse.fileId, tempJsonArr: uploadResponse.tempJsonArr }
    } else {
      return { fileUrl: null, fileId: null, tempJsonArr: null }
    }
  } catch (err) {
    console.log("ERROR: ", err);
    return { fileUrl: null, fileId: null, tempJsonArr: null }
  }
}




