import { AxiosObj } from '../../Configurations/axios-setup';

class collectionItemsService {
    getAllItemsInCollection(accountId, subscriptionId, subscriberId, collectionId, searchCriteriaObj) {
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/${collectionId}/item/fetch`, searchCriteriaObj, {
            'accept': 'application/json'
        })
    }
    createCollectionItem(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/${collectionId}/item/create`, resObj, {
            'accept': 'application/json'
        })
    }
    modifyCollectionItem(accountId, subscriptionId, subscriberId, collectionId, collectionIemId, resObj) {
        return AxiosObj.put(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/${collectionId}/item/${collectionIemId}/update/by/fields`, resObj, {
            'accept': 'application/json'
        })
    }
    publishCollectionItem(accountId, subscriptionId, subscriberId, collectionId, collectionIemId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/${collectionId}/item/${collectionIemId}/publish`)
    }
    getItemsBySingularId(accountId, authorAccountId, pluralId, version, schemaId, entryType = "user", accessType = "public", queryParams = null) {
        if (queryParams)
            return AxiosObj.get(`/${accountId}/api/collection/${authorAccountId}/${entryType}/${accessType}/cm/v${version}/${schemaId}/${pluralId}?${queryParams}`)
        return AxiosObj.get(`/${accountId}/api/collection/${authorAccountId}/${entryType}/${accessType}/cm/v${version}/${schemaId}/${pluralId}`)
    }
    createCollectionItemBySingularId(accountId, authorAccountId, pluralId, version, schemaId, resObj, entryType = "user", accessType = "public") {
        return AxiosObj.post(`/${accountId}/api/collection/${authorAccountId}/${entryType}/${accessType}/cm/v${version}/${schemaId}/${pluralId}`, resObj, {
            'accept': 'application/json'
        })
    }
    updateCollectionItemBySingularId(accountId, authorAccountId, singularId, version, schemaId, itemId, resObj, hashNumber = "", hashCode = "", entryType = "user", accessType = "public") {
        return AxiosObj.put(`/${accountId}/api/collection/${authorAccountId}/${entryType}/${accessType}/cm/v${version}/${schemaId}/${singularId}/${itemId}`, resObj, {
            headers: {
                'Content-Type': 'application/json',
                'etag-hash': hashCode,
                'etag-random-number': hashNumber
            }
        })
    }
    deleteCollectionItem(accountId, authorAccountId, singularId, version, schemaId, itemId, entryType = "user", accessType = "public") {
        return AxiosObj
            .delete(`/${accountId}/api/collection/${authorAccountId}/${entryType}/${accessType}/cm/v${version}/${schemaId}/${singularId}/${itemId}`)
    }
}

const CollectionItemsService = new collectionItemsService();
export default CollectionItemsService;