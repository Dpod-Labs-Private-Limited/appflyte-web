import { AxiosObjCollection } from '../../Configurations/axios-setup';

class collectionTypesService {
    getSupportedFieldTypes() {
        return AxiosObjCollection.get(`/api/collection/collection-fields`)
    }
    getSupportedLanguages() {
        return AxiosObjCollection.get(`/api/collection/languages`)
    }
    getTemplateList() {
        return AxiosObjCollection.get(`/publisc-lookups/templates/`)
    }
    getAllCollectionTypesForCoach(accountId, subscriptionId, subscriberId, schema_id) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/definition?schema_id=${schema_id}`)
    }
    getCollectionTypesByIdForCoach(accountId, subscriptionId, subscriberId, collectionId) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/definition/${collectionId}`)
    }
    createNewCollectionType(accountId, subscriptionId, subscriberId, resObj) {
        return AxiosObjCollection.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/definition`, resObj, {
            'accept': 'application/json'
        })
    }
    deleteCollectionType(accountId, subscriptionId, subscriberId, collectionId) {
        return AxiosObjCollection.delete(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/definition/${collectionId}`)
    }
    updateCollectionFields(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        return AxiosObjCollection.put(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/definition/${collectionId}`, resObj, {
            'accept': 'application/json'
        })
    }
    publishCollectionType(accountId, subscriptionId, subscriberId, collectionId) {
        return AxiosObjCollection.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/publish/${collectionId}`, { "collection_id": collectionId }, {
            'accept': 'application/json'
        })
    }
    saveCollectionConfiguration(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        return AxiosObjCollection.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/configure/view/${collectionId}`, resObj, {
            'accept': 'application/json'
        })
    }
    getCollectionConfiguration(accountId, subscriptionId, subscriberId, collectionId) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/publish/${collectionId}`)
    }
    getFieldSetConfiguration(accountId, subscriptionId, subscriberId, collectionId) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/fieldset/publish/${collectionId}`)
    }
    saveFieldSetConfiguration(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        return AxiosObjCollection.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/configure/view/fieldset/${collectionId}`, resObj, {
            'accept': 'application/json'
        })
    }
    getAllFieldSetsForCoach(accountId, subscriptionId, subscriberId, schemaId) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${schemaId}/collection/fieldset/definition`)
    }
    createNewCollectionFieldSet(accountId, subscriptionId, subscriberId, resObj) {
        return AxiosObjCollection.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/fieldset/definition`, resObj, {
            'accept': 'application/json'
        })
    }
    deleteFieldSet(accountId, subscriptionId, subscriberId, collectionId) {
        return AxiosObjCollection.delete(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/fieldset/definition/${collectionId}`)
    }
    publishFieldSet(accountId, subscriptionId, subscriberId, collectionId) {
        return AxiosObjCollection.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/fieldset/publish/${collectionId}`, { "fieldset_id": collectionId }, {
            'accept': 'application/json'
        })
    }
    getFieldSetByIdForCoach(accountId, subscriptionId, subscriberId, collectionId) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/fieldset/definition/${collectionId}`)
    }
    updateFieldSetFields(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        return AxiosObjCollection.put(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/fieldset/definition/${collectionId}`, resObj, {
            'accept': 'application/json'
        })
    }
    getPublishedCollectionTypes(accountId, subscriptionId, subscriberId) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/publish`)
    }
    getPublishedCollectionTypesPagination(accountId, subscriptionId, subscriberId, schema_id, lastEvaluatedKey, limit) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/publish?limit=${limit}&last_evaluated_key=${lastEvaluatedKey}&include_detail=true&schema_id=${schema_id}`)
    }
    getPublishedFieldSets(accountId, subscriptionId, subscriberId, schema_id, lastEvaluatedKey, limit) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/fieldset/publish?limit=${limit}&last_evaluated_key=${lastEvaluatedKey}&include_detail=true&schema_id=${schema_id}`)
    }
    getAppAndPluginList(accountId, subscriptionId, subscriberId) {
        return AxiosObjCollection.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection-modules`)
    }
    installAppPlugin(accountId, resObj) {
        return AxiosObjCollection.post(`/${accountId}/api/collection/create/collection/install-plugin`, resObj, {
            'accept': 'application/json'
        })
    }
}

const CollectionTypesService = new collectionTypesService();
export default CollectionTypesService;