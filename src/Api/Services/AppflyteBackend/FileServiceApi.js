import { AxiosObj } from "../../Configurations/axios-setup";
import { fetchAccountId, fetchSubscriberId, fetchSubscriptionId } from "../../../utils/GetAccountDetails";
import axios from "axios";

class DpodAppFlyteApi {

    constructor() {
        this.accountId = null;
    }

    async initialize() {
        this.accountId = await fetchAccountId();
        this.subscriberId = await fetchSubscriberId()
        this.subscriptionId = await fetchSubscriptionId()
    }

    getPresignedURL = async (reqBody) => {
        await this.initialize();
        return AxiosObj.post(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/generate-upload-url`, reqBody)
    }

    getPresignedURLByFilename = async (reqBody) => {
        await this.initialize();
        return AxiosObj.post(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/generate-upload-url-by-file`, reqBody)
    }

    getUploadedFileUrls = async (fileIds) => {
        await this.initialize();
        return AxiosObj.get(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/generate-upload-url?fileId=${fileIds}`)
    }

    uploadFile = async (url, reqBody) => {
        return axios.post(url, reqBody)
    }

    createFile = async (reqBody) => {
        await this.initialize();
        return AxiosObj.post(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/file`, reqBody)
    }

    getFile = async (file_id) => {
        await this.initialize();
        return AxiosObj.get(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/file/${file_id}`)
    }

    getDownloadUrl = async (object_paths) => {
        await this.initialize();
        const bucket_name = 'dpod-ai';
        return AxiosObj.post(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/generate-download-url?bucket_name=${bucket_name}&object_paths=${object_paths}`)
    }

    getDownUrlByPath = async (bucket_name, object_paths) => {
        await this.initialize();
        return AxiosObj.post(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/generate-download-url?bucket_name=${bucket_name}&object_paths=${object_paths}`)
    }

    getUploadURLByPath = async (reqBody) => {
        await this.initialize();
        return AxiosObj.post(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/generate-upload-url-exact-path`, reqBody)
    }

    getAmeyaDownloadUrl = async (bucket_name, object_paths) => {
        await this.initialize();
        return AxiosObj.post(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/ameya-generate-download-url?bucket_name=${bucket_name}&object_paths=${object_paths}`)
    }

    getFilesById = async (file_id) => {
        await this.initialize();
        return AxiosObj.get(`/${this.accountId}/api/collection/${this.accountId}/user/private/cm/v1/${process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID}/platform_file/${file_id}`)
    }

    deleteFolder = async (folderPath) => {
        await this.initialize();
        const encodedPath = encodeURIComponent(folderPath);
        return AxiosObj.delete(`/api/media/${this.accountId}/subscriber/${this.subscriberId}/subscription/${this.subscriptionId}/s3-folders/${encodedPath}`)
    }
}

const FilesApi = new DpodAppFlyteApi();
export default FilesApi;
