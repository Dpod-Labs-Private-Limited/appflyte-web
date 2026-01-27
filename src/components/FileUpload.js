import moment from "moment";
import FilesApi from "../Api/Services/AppflyteBackend/FileServiceApi";

let resJsonVar = []

const uploadFile = async (blob, reqBody) => {
    try {
        const resData = await FilesApi.getPresignedURLByFilename(JSON.stringify(reqBody))
        if (resData.status === 200) {
            const urlFields = JSON.parse(resData.data.url_fields)
            let formData = new FormData();

            formData.append('key', urlFields.key);
            formData.append('AWSAccessKeyId', urlFields.AWSAccessKeyId);
            formData.append('policy', urlFields.policy);
            formData.append('signature', urlFields.signature);
            formData.append('file', blob);

            const resUpload = await FilesApi.uploadFile(resData.data.url, formData)
            if (resUpload.status === 200 || resUpload.status === 204) {
                return resData?.data?.file_id
            }
            return null
        }
        return null
    } catch (e) {
        console.log('Err ' + e)
        return null
    }
}


const uploadAndAppendForPost = async (filename, foldername, file, fileType, thumbnailFileId) => {
    try {

        const reqBodyFile = {
            file_context: 'analytics_config',
            content_type: file?.name?.split('.')[1],
            file_type: '',
            file_name: filename,
            folder_name: foldername
        }

        const uploadedFileId = await uploadFile(file, reqBodyFile)
        if (uploadedFileId) {
            const uploadedFileUrl = await FilesApi.getUploadedFileUrls(uploadedFileId)
            if (uploadedFileUrl.status === 200) {
                const tempJsonArr = [...resJsonVar]
                const uploadResObj = {
                    file_id: uploadedFileId,
                    folder_id: null,
                    access_type: "PUBLIC",
                    file_type: fileType,
                    file_attributes: {
                        file_name: filename,
                        file_url: uploadedFileUrl?.data?.[0]?.download_url,
                        created_on: moment().format("DD-MM-YYYY"),
                        file_extension: file?.name?.split('.')[1]
                    },
                    thumbnail_file_id: thumbnailFileId,
                    is_hidden: true
                }
                tempJsonArr.push(uploadResObj)
                resJsonVar = tempJsonArr
                return { fileId: uploadedFileId, fileUrl: uploadedFileUrl?.data?.[0]?.download_url }
            }
            return { fileId: null, fileUrl: null }
        }
        return { fileId: null, fileUrl: null }
    }
    catch (err) {
        console.log("ERROR: ", err);
        return { fileId: null, fileUrl: null }
    }
}


const handleDocumentUpload = async (filename, foldername, file) => {
    try {
        const file_type = filename?.split('.')[1];
        const uploadResponse = await uploadAndAppendForPost(filename, foldername, file, file_type, null)

        if (uploadResponse.fileUrl && uploadResponse.fileId) {

            if (uploadResponse.fileUrl && uploadResponse.fileId) {
                return { status: 200, fileUrl: uploadResponse.fileUrl }
            } else {
                return { status: 404 }
            }
        }
        return { status: 404 }
    }
    catch (err) {
        console.log("ERROR: ", err);
        return { status: 404 }
    }
}
export default handleDocumentUpload;