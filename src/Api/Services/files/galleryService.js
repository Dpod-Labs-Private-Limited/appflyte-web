import { AxiosObj } from "../../Configurations/axios-setup"

class galleryService {
  createFile(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    return AxiosObj.post(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/file`, reqBody, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  modifyFiles(accountId, subscriberId, subscriptionId, schemaId, fileId, reqBody) {
    return AxiosObj
      .put(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/file/${fileId}`, reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  moveFiles(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    return AxiosObj
      .patch(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/file`, reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  createFolder(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    return AxiosObj
      .post(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder`, reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  deleteFolder(accountId, subscriberId, subscriptionId, schemaId, folderIds) {
    const folderIdStr = folderIds.join()
    return AxiosObj
      .delete(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder?folderId=${folderIdStr}`)
  }

  deleteFiles(accountId, subscriberId, subscriptionId, schemaId, fileIds) {
    const fileIdStr = fileIds.join()
    return AxiosObj
      .delete(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/file?fileId=${fileIdStr}`)
  }

  getDownloadURL(accountId, subscriberId, subscriptionId, schemaId, bucket_name, object_paths) {
    return AxiosObj
      .post(`/api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/generate-download-url?bucket_name=${bucket_name}&object_paths=${object_paths}`, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  getFolderContents(accountId, subscriberId, subscriptionId, schemaId, parentFolderId, fileType) {
    if (parentFolderId == null && fileType == null)
      return AxiosObj
        .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder`)
    if (parentFolderId != null && fileType != null)
      return AxiosObj
        .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder?folderId=${parentFolderId}&fileType=${fileType}`)
    if (parentFolderId != null)
      return AxiosObj
        .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder?folderId=${parentFolderId}`)
    return AxiosObj
      .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder?fileType=${fileType}`)
  }

  modifyFolder(accountId, subscriberId, subscriptionId, schemaId, folderId, reqBody) {
    return AxiosObj
      .put(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder/${folderId}`, reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  moveFolder(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    return AxiosObj
      .patch(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder`, reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  getRecycleBinContent(accountId, subscriberId, subscriptionId, schemaId, parentFolderId = null, fileType = null) {
    if (parentFolderId == null && fileType == null)
      return AxiosObj
        .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder/recycle-bin`)
    if (parentFolderId != null && fileType != null)
      return AxiosObj
        .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder/recycle-bin?folderId=${parentFolderId}&fileType=${fileType}`)
    if (parentFolderId != null)
      return AxiosObj
        .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder/recycle-bin?folderId=${parentFolderId}`)
    return AxiosObj
      .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder/recycle-bin?fileType=${fileType}`)
  }

  recycleBinRestoreFolder(accountId, subscriberId, subscriptionId, schemaId, folderIds) {
    const folderIdStr = folderIds.join()
    return AxiosObj
      .patch(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder/recycle-bin?folderId=${folderIdStr}`)
  }

  recycleBinRestoreFiles(accountId, subscriberId, subscriptionId, schemaId, fileIds) {
    const fileIdStr = fileIds.join()
    return AxiosObj
      .patch(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/file/recycle-bin?fileId=${fileIdStr}`)
  }

  recycleBinFolderPermanentDelete(accountId, subscriberId, subscriptionId, schemaId, folderIds) {
    const folderIdStr = folderIds.join()
    return AxiosObj
      .delete(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder/recycle-bin?folderId=${folderIdStr}`)
  }

  recycleBinFilesPermanentDelete(accountId, subscriberId, subscriptionId, schemaId, fileIds) {
    const fileIdStr = fileIds.join()
    return AxiosObj
      .delete(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/file/recycle-bin?fileId=${fileIdStr}`)
  }

  getSharedContent(accountId, subscriberId, subscriptionId, schemaId) {
    return AxiosObj
      .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/shared`)
  }

  shareFolders(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    return AxiosObj
      .post(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/folder/share`, reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  shareFiles(accountId, subscriberId, subscriptionId, schemaId, reqBody) {
    return AxiosObj
      .post(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/file/share`, reqBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
  }

  getSharedUsersListForEntity(accountId, subscriberId, subscriptionId, schemaId, entityId) {
    return AxiosObj
      .get(`api/media/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/${schemaId}/shared/entity/${entityId}`)
  }

}

const GalleryService = new galleryService();
export default GalleryService;
