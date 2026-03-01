import { AxiosObj } from "../../Configurations/axios-setup"

class collectionsService {
    getAllTagsForSubscription(subscriptionId, subscriberId, entityType, entityId) {
        return AxiosObj
            .get(`/api/collection/tag/subscriber/${subscriberId}/subscription/${subscriptionId}/entity/${entityType}/id/${entityId}`)
    }
    getAllTagsForEntityType(subscriptionId, subscriberId, entityType) {
        return AxiosObj
            .get(`/api/collection/tag/subscriber/${subscriberId}/subscription/${subscriptionId}/entity/${entityType}`)
    }
    createNewTag(accountId, subscriptionId, subscriberId, resObj) {
        return AxiosObj
            .post(`/api/collection/tag/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/`, resObj, {
                'accept': 'application/json'
            })
    }
    overwriteTags(accountId, subscriptionId, subscriberId, resObj) {
        return AxiosObj
            .put(`/api/collection/tag/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/`, resObj, {
                'accept': 'application/json'
            })
    }
    getCollectionsForEntity(subscriptionId, subscriberId, entityType) {
        return AxiosObj
            .get(`/api/collection/tag/subscriber/${subscriberId}/subscription/${subscriptionId}/entity/${entityType}/all-tags`)
    }
    createCollectionsForEntity(accountId, subscriptionId, subscriberId, resObj) {
        return AxiosObj
            .post(`/api/collection/tag/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/collection`, resObj, {
                'accept': 'application/json'
            })
    }
    modifyCollectionsForEntity(accountId, subscriptionId, subscriberId, resObj) {
        return AxiosObj
            .put(`/api/collection/tag/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/collection`, resObj, {
                'accept': 'application/json'
            })
    }
    removeCollectionsForEntity(accountId, subscriptionId, subscriberId, resObj) {
        return AxiosObj
            .put(`/api/collection/tag/${accountId}/subscriber/${subscriberId}/subscription/${subscriptionId}/deactivate-collection`, resObj, {
                'accept': 'application/json'
            })
    }
}

const CollectionsService = new collectionsService();
export default CollectionsService;