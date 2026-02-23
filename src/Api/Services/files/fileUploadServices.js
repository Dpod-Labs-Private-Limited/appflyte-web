import axios from 'axios';
import { AxiosObjCollection } from '../../Configurations/axios-setup';

class fileUploadServices {
  getPredignedURL(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    return AxiosObjCollection
      .post(`/api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/generate-upload-url`, reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }


  uploadFile(url, reqBody) {
    try {
      return axios.post(url, reqBody)
    }
    catch (error) {
      console.log("error while uploading file", error)
    }
  }

  azureUploadFile(url, file) {
    // Create axios instance with this url
    try {
      return axios.put(url, file, {
        headers: {
          'x-ms-blob-type': 'BlockBlob',
          'Access-Control-Allow-Origin': '*'
        },
      });
    }
    catch (error) {
      console.log("error while uploading file", error)
    }
  }
}

const FileUploadServices = new fileUploadServices();
export default FileUploadServices;
