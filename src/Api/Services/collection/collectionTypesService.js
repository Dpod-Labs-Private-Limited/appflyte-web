import { AxiosBaseObj, AxiosObj } from '../../Configurations/axios-setup';

class collectionTypesService {
    getSupportedFieldTypes() {
        return AxiosBaseObj.get(`/api/collection/collection-fields`)
    }
    getSupportedLanguages() {
        return AxiosBaseObj.get(`/api/collection/languages`)
    }
    getTemplateList() {
        return AxiosObj.get(`/publisc-lookups/templates/`)
    }
    getAllCollectionTypesForCoach(accountId, subscriptionId, subscriberId, schema_id) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/definition?collection_schema_id=${schema_id}`)
    }
    getCollectionTypesByIdForCoach(accountId, subscriptionId, subscriberId, collectionId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/definition/${collectionId}`)
    }
    createNewCollectionType(accountId, subscriptionId, subscriberId, resObj) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/definition`, resObj, {
            'accept': 'application/json'
        })
    }
    deleteCollectionType(accountId, subscriptionId, subscriberId, collectionId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.delete(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/definition/${collectionId}`)
    }
    updateCollectionFields(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.put(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/definition/${collectionId}`, resObj, {
            'accept': 'application/json'
        })
    }
    publishCollectionType(accountId, subscriptionId, subscriberId, collectionId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/publish/${collectionId}`, { "collection_id": collectionId }, {
            'accept': 'application/json'
        })
    }
    saveCollectionConfiguration(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/configure/view/${collectionId}`, resObj, {
            'accept': 'application/json'
        })
    }
    getCollectionConfiguration(accountId, subscriptionId, subscriberId, collectionId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/publish/${collectionId}`)
    }
    getFieldSetConfiguration(accountId, subscriptionId, subscriberId, collectionId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/fieldset/publish/${collectionId}`)
    }
    saveFieldSetConfiguration(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/configure/view/fieldset/${collectionId}`, resObj, {
            'accept': 'application/json'
        })
    }
    getAllFieldSetsForCoach(accountId, subscriptionId, subscriberId, schemaId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/fieldset/definition?collection_schema_id=${schemaId}`)
    }
    createNewCollectionFieldSet(accountId, subscriptionId, subscriberId, resObj) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/fieldset/definition`, resObj, {
            'accept': 'application/json'
        })
    }
    deleteFieldSet(accountId, subscriptionId, subscriberId, collectionId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.delete(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/fieldset/definition/${collectionId}`)
    }
    publishFieldSet(accountId, subscriptionId, subscriberId, collectionId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.post(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/fieldset/publish/${collectionId}`, { "fieldset_id": collectionId }, {
            'accept': 'application/json'
        })
    }
    getFieldSetByIdForCoach(accountId, subscriptionId, subscriberId, collectionId) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/fieldset/definition/${collectionId}`)
    }
    updateFieldSetFields(accountId, subscriptionId, subscriberId, collectionId, resObj) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.put(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/collection/fieldset/definition/${collectionId}`, resObj, {
            'accept': 'application/json'
        })
    }
    getPublishedCollectionTypes(accountId, subscriptionId, subscriberId) {
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection/publish`)
    }
    getPublishedCollectionTypesPagination(accountId, subscriptionId, subscriberId, schema_id, lastEvaluatedKey, limit) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/published/collections?limit=${limit}&last_evaluated_key=${lastEvaluatedKey}&include_detail=true&collection_schema_id=${schema_id}`)
    }
    getPublishedFieldSets(accountId, subscriptionId, subscriberId, schema_id, lastEvaluatedKey, limit) {
        const default_schema_id = process.env.REACT_APP_APPFLYTE_COLLECTIONS_SCHEMA_ID ?? null;
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/schema/${default_schema_id}/published/collection/fieldsets?limit=${limit}&last_evaluated_key=${lastEvaluatedKey}&include_detail=true&fieldset_schema_id=${schema_id}`)
    }
    getAppAndPluginList(accountId, subscriptionId, subscriberId) {
        return AxiosObj.get(`/${accountId}/api/collection/subscriber/${subscriberId}/subscription/${subscriptionId}/collection-modules`)
    }
    installAppPlugin(accountId, resObj) {
        return AxiosObj.post(`/${accountId}/api/collection/create/collection/install-plugin`, resObj, {
            'accept': 'application/json'
        })
    }
}

const CollectionTypesService = new collectionTypesService();
export default CollectionTypesService;