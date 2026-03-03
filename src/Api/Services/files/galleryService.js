import { AxiosObj } from "../../Configurations/axios-setup"

class galleryService {
  createFile(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.post(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/file`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  modifyFiles(accountId, subscriberId, subscriptionId, schemaId, fileId, reqBody) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.put(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/file/${fileId}`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  moveFiles(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.patch(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/file`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  createFolder(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.post(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  deleteFolder(accountId, subscriberId, subscriptionId, schemaId, folderIds) {
    const folderIdStr = folderIds.join()
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.delete(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder?folderId=${folderIdStr}`)
  }

  deleteFiles(accountId, subscriberId, subscriptionId, schemaId, fileIds) {
    const fileIdStr = fileIds.join()
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.delete(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/file?fileId=${fileIdStr}`)
  }

  getDownloadURL(accountId, subscriberId, subscriptionId, schemaId, bucket_name, object_paths) {
    return AxiosObj.post(`/api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/generate-download-url?bucket_name=${bucket_name}&object_paths=${object_paths}`, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getFolderContents(accountId, subscriberId, subscriptionId, schemaId, parentFolderId, fileType) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    if (parentFolderId == null && fileType == null)
      return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder`)
    if (parentFolderId != null && fileType != null)
      return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder?folderId=${parentFolderId}&fileType=${fileType}`)
    if (parentFolderId != null)
      return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder?folderId=${parentFolderId}`)
    return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder?fileType=${fileType}`)
  }

  modifyFolder(accountId, subscriberId, subscriptionId, schemaId, folderId, reqBody) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.put(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder/${folderId}`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  moveFolder(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.patch(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getRecycleBinContent(accountId, subscriberId, subscriptionId, schemaId, parentFolderId = null, fileType = null) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    if (parentFolderId == null && fileType == null)
      return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder/recycle-bin`)
    if (parentFolderId != null && fileType != null)
      return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder/recycle-bin?folderId=${parentFolderId}&fileType=${fileType}`)
    if (parentFolderId != null)
      return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder/recycle-bin?folderId=${parentFolderId}`)
    return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder/recycle-bin?fileType=${fileType}`)
  }

  recycleBinRestoreFolder(accountId, subscriberId, subscriptionId, schemaId, folderIds) {
    const folderIdStr = folderIds.join()
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.patch(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder/recycle-bin?folderId=${folderIdStr}`)
  }

  recycleBinRestoreFiles(accountId, subscriberId, subscriptionId, schemaId, fileIds) {
    const fileIdStr = fileIds.join()
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.patch(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/file/recycle-bin?fileId=${fileIdStr}`)
  }

  recycleBinFolderPermanentDelete(accountId, subscriberId, subscriptionId, schemaId, folderIds) {
    const folderIdStr = folderIds.join()
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.delete(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder/recycle-bin?folderId=${folderIdStr}`)
  }

  recycleBinFilesPermanentDelete(accountId, subscriberId, subscriptionId, schemaId, fileIds) {
    const fileIdStr = fileIds.join()
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.delete(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/file/recycle-bin?fileId=${fileIdStr}`)
  }

  getSharedContent(accountId, subscriberId, subscriptionId, schemaId) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/shared`)
  }

  shareFolders(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.post(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/folder/share`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  shareFiles(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.post(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/file/share`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  getSharedUsersListForEntity(accountId, subscriberId, subscriptionId, schemaId, entityId) {
    const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
    return AxiosObj.get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${default_schema_id}/${schemaId}/shared/entity/${entityId}`)
  }

}

const GalleryService = new galleryService();
export default GalleryService;
